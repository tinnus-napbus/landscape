/-  spider
/+  *strandio, perms, treaty
::
=,  strand=strand:spider
::
::  send on /spider/garden/json/get-passport/json
::
^-  thread:spider
|=  jon=vase
=/  m  (strand ,vase)
^-  form:m
;<  =bowl:spider  bind:m  get-bowl
?~  jun=!<((unit json) jon)
  (pure:m !>(`json`[%s 'invalid-request']))
=/  pes=pers:gall  (pers:dejs:treaty u.jun)
=/  pas=passport:perms  (make-passport:treaty our.bowl now.bowl pes)
(pure:m !>(`json`(passport:enjs:treaty pas)))
