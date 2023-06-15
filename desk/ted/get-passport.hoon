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
=/  [des=(unit desk) pes=pers:gall]
  =,  dejs:format
  ((ot desk+(mu so) seal+pers:dejs:treaty ~) u.jun)
=/  pas=passport:perms
  (make-passport:treaty our.bowl now.bowl pes des)
(pure:m !>(`json`(passport:enjs:treaty pas)))
