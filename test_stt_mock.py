import unittest
from unittest.mock import MagicMock
import sys

# 1. Define dummy exception classes that inherit from Exception
class MockUnknownValueError(Exception):
    pass

class MockRequestError(Exception):
    pass

# 2. Create the mock module
mock_sr = MagicMock()
# Assign the exception classes to the mock module
mock_sr.UnknownValueError = MockUnknownValueError
mock_sr.RequestError = MockRequestError

# 3. Inject the mock into sys.modules BEFORE importing the module under test
sys.modules["speech_recognition"] = mock_sr

# 4. Now import the module. It will see 'speech_recognition' as our mock_sr.
#    Since stt_engine does `import speech_recognition as sr`, 
#    `sr.UnknownValueError` will compile to our MockUnknownValueError class.
from stt_engine import listen_and_convert

class TestSTTEngine(unittest.TestCase):

    def setUp(self):
        # Reset mocks before each test
        mock_sr.reset_mock()
        # Ensure exceptions are still attached (reset_mock doesn't delete attributes usually, but good to be safe if we were replacing them)
        mock_sr.UnknownValueError = MockUnknownValueError
        mock_sr.RequestError = MockRequestError

    def test_listen_and_convert_success(self):
        # Setup
        mock_recognizer = MagicMock()
        mock_sr.Recognizer.return_value = mock_recognizer
        mock_mic = MagicMock()
        mock_sr.Microphone.return_value = mock_mic
        # Context manager support
        mock_mic.__enter__.return_value = MagicMock()
        
        # Configure successful return
        mock_recognizer.listen.return_value = "audio_data"
        mock_recognizer.recognize_google.return_value = "Hello world"
        
        # Execute
        result = listen_and_convert()
        
        # Assert
        self.assertTrue(result["success"])
        self.assertEqual(result["text"], "Hello world")
        print("\n[Mock] Test Success: Passed")

    def test_unknown_value_error(self):
        mock_recognizer = MagicMock()
        mock_sr.Recognizer.return_value = mock_recognizer
        mock_sr.Microphone.return_value.__enter__.return_value = MagicMock()
        
        # Configure side effect to raise specific exception
        mock_recognizer.recognize_google.side_effect = MockUnknownValueError()
        
        result = listen_and_convert()
        
        self.assertFalse(result["success"])
        self.assertIn("Could not understand", result["error"])
        print("\n[Mock] Test UnknownValueError: Passed")

    def test_request_error(self):
        mock_recognizer = MagicMock()
        mock_sr.Recognizer.return_value = mock_recognizer
        mock_sr.Microphone.return_value.__enter__.return_value = MagicMock()
        
        # Configure side effect
        mock_recognizer.recognize_google.side_effect = MockRequestError("Connection failed")
        
        result = listen_and_convert()
        
        self.assertFalse(result["success"])
        self.assertIn("API error", result["error"])
        print("\n[Mock] Test RequestError: Passed")

if __name__ == "__main__":
    unittest.main()
