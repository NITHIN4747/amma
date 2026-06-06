import os
from datetime import datetime
from twilio.rest import Client

# Date check: Only execute on her birthday (June 7th)
# Note: GitHub Actions runs in UTC. 12:00 AM IST (June 7) is 6:30 PM UTC (June 6).
# So we check the current date/time to see if we've reached her birthday.
# We'll support both UTC and local timezone checks.
current_date_utc = datetime.utcnow().strftime("%m-%d")

# Since GitHub Actions runs at 18:30 UTC on June 6th (which is 12:00 AM IST June 7th),
# we can check if it is either June 7th in UTC, OR June 6th/7th depending on timezone offset.
# Alternatively, since we configure the cron trigger for a specific day or we just check if it's June 6/7.
# A robust way is to check if it matches June 7th in IST (UTC + 5:30).
import pytz
ist = pytz.timezone('Asia/Kolkata')
current_date_ist = datetime.now(ist).strftime("%m-%d")

if current_date_ist != "06-07":
    print(f"Date check failed. Current IST date is {current_date_ist}, waiting for 06-07. Skipping.")
    exit(0)

# Get Twilio credentials from environment variables
account_sid = os.environ.get("TWILIO_SID")
auth_token  = os.environ.get("TWILIO_TOKEN")
twilio_num  = os.environ.get("TWILIO_NUMBER") # We can also load from env or replace with a static verified phone number
mom_num     = os.environ.get("MOM_NUMBER")

if not account_sid or not auth_token:
    print("Error: TWILIO_SID or TWILIO_TOKEN environment variables not set.")
    exit(1)

client = Client(account_sid, auth_token)

# Send the message
message_body = (
    "🎂 Happy Birthday Amma! 🎂\n"
    "Made something special just for you with all my love! 💕\n"
    "👉 https://mom-birthday.vercel.app\n\n"
    "Love you so much ❤️ — Nithin"
)

message = client.messages.create(
    body=message_body,
    from_=twilio_num or "+12513128795",  # Replace with user's Twilio number or load from env
    to=mom_num or "+919442084450"       # Replace with user's Mom's number or load from env
)

print(f"Birthday wish sent successfully! Message SID: {message.sid}")
