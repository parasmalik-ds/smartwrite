import openai

def get_response(conversation):
    openai.api_key = 'sk-'
    print( conversation)
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=conversation,
        temperature=0.7,
        max_tokens=250,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        )
    print(response)
    return response.get("choices")[0].get("text")

from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "https://mail.google.com",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/")
async def get_details_from_id(request: Request):
  msg = await request.json()
  print("Input Recieved from Front\n", msg)
  message_id = msg.get("msg_id")
  msg_body = msg.get("msg_body")
  msg_type = msg.get("type")
  
  data = {}
  try:
    if msg_type == "new_mail":
      prompt = "Generate a professional email with a subject line and add signature if provided by user.\n"+msg_body
      resp = get_response(prompt)
      message =[]
      for i in resp.split("\n"):
        if ("subject" in i.lower()) and (":" in i):
          data["subject"] = i.split(":")[-1]
        else: 
          message.append(i)
      data["data"] = " ".join(message)
      print(data)
      return data

    if msg_type =='reply_mail':
      name = msg.get("name")
      from_email = msg.get("email")
      msg_subject = msg.get("subject")
      prompt = "Email Recieved From: "+ name +" with subject: "+msg_subject
      prompt += "Email Body: "+msg_body
      prompt +="\n\nGenerate a reply for the mail provided above in professional manner."
      resp = get_response(prompt)
      data["data"]= resp
      return data
      
  except Exception as e:
    print("Error In API",e)
    return{"data": "Encountered an error:"+e}
