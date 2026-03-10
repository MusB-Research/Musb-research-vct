import requests
import time

url_login = "http://localhost:8000/api/auth/login"
url_health = "http://localhost:8000/api/health"

def test_login_limit():
    print(">>> Phase 1: Custom Auth Rate Limiting (Limit: 20 per 15 min)")
    success_count = 0
    for i in range(1, 40):
        try:
            # We don't need real credentials, just hit the route
            response = requests.post(url_login, data={"username": "attacker@spam.me", "password": "nop"})
            if response.status_code == 429:
                print(f"[REJECT] Request {i}: 429 Too Many Requests (SUCCESS: Limit is working)")
                print(f"        Message: {response.json().get('detail')}")
                return True
            else:
                success_count += 1
                if i % 5 == 0:
                    print(f"        Request {i}: Got {response.status_code} (still allowed)")
        except Exception as e:
            print(f"        Error: {e}")
            break
    print(f"!!! Error: Hit {success_count} requests without a 429. Custom limit might be failing.")
    return False

def test_global_limit():
    print("\n>>> Phase 2: Global SlowAPI Rate Limiting (Limit: 200 per min)")
    for i in range(1, 250):
        try:
            response = requests.get(url_health)
            if response.status_code == 429:
                print(f"[REJECT] Global Request {i}: 429 (SUCCESS: Global limit is working)")
                return True
            if i % 50 == 0:
                print(f"        Global Request {i}: Got {response.status_code} (still allowed)")
        except Exception as e:
            print(f"        Error: {e}")
            break
    print(f"!!! Error: Global limit might be failing.")
    return False

if __name__ == "__main__":
    login_ok = test_login_limit()
    global_ok = test_global_limit()
    
    if login_ok and global_ok:
        print("\nSUMMARY: RATE LIMITING IS WORKING PERFECTLY.")
    else:
        print("\nSUMMARY: SOME RATE LIMITS MIGHT NOT BE ACTIVE.")
