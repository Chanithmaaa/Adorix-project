
# Import the function we just made in the other file
from stt_engine import listen_and_convert

def run_task_27_test():
    print("======================================")
    print("   RUNNING TASK #27: STT TEST FILE    ")
    print("======================================")
    
    # Run the engine
    result = listen_and_convert()
    
    # Check if it worked
    if result["success"]:
        print("\nTEST PASSED!")
        print(f"You just said: '{result['text']}'")
    else:
        print("\nTEST FAILED.")
        print(f"Reason: {result['error']}")

# This makes sure the test runs when we execute the file
if __name__ == "__main__":
    run_task_27_test()