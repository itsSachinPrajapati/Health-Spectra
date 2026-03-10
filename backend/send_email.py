import resend # type:ignore

resend.api_key = "re_i2GAdSSr_K73uRiHJKMVZV5PP2p6haorq"

r = resend.Emails.send({
  "from": "onboarding@resend.dev",
  "to": "sachin.prajapati23@ds.sce.edu.in",
  "subject": "Hello World",
  "html": "<p>Congrats on sending your <strong>first email</strong>!</p>"
})
