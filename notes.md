
These are running notes for the website. There are a great deal of things that need to be done before I've got anything that I'm happy with showing to the outside world. There are a lot of files right now, not sure that every one is functional or relevant.

That being said, right now the majority of the work is with file clean-up. As such, there should be an -old suffix for a lot of the current files that will have a lot of the commented out code that never ends up getting used (but is instructive nonetheless). Also, I am happy with the landingPage (index.html or isaranwrap.github.io) and I should work on creating a similar landing Page for everything thereafter. The first should be the easiest - with selecting one of two: (1) LEARN A LANGUAGE and (2) LEARN CHESS.

Then after, it can get more complicated as the tree grows but the initial foray would be something quite simple and linear. 


Problem i encountered with git push, resolved it by:

>> cd ~/.ssh
>> ssh-keygen -t rsa -b 4096 -C "ishansaran65@gmail.com"

Then, (ls shows you) I added the id_rsa.pub file starting with `ssh-rsa AA...== ishansaran65@gmail.com" to https://github.com/settings/keys (after signing in) and that allowed me to connect via ssh." 

I can check this with

>>  ssh -vT git@github.com



