import speech_recognition as sr

def listen_and_convert():
    # Initialize the recognizer
    recognizer = sr.Recognizer()
    
    try:
        # Use the default system microphone
        with sr.Microphone() as source:
            print("[System] Adjusting for background noise... wait 1 second.")
            recognizer.adjust_for_ambient_noise(source, duration=1)
            
            print("[System] Listening... Please speak into your microphone now!")
            # Listen for up to 5 seconds
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=5)
            
            print("[System] Processing your voice...")
            # Use Google's free built-in recognizer to convert it to text
            text = recognizer.recognize_google(audio)
            
            return {"success": True, "text": text}
            
    except sr.UnknownValueError:
        return {"success": False, "error": "Could not understand the audio. Please speak louder."}
    except sr.RequestError as e:
        return {"success": False, "error": f"API error (check internet): {e}"}
    except Exception as e:
        return {"success": False, "error": f"Microphone error: {e}"}