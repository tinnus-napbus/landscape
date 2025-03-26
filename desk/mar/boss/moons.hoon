/-  boss
/+  lib=boss
|_  mons=(map @p [=life =rift])
++  grow
  |%
  ++  noun  mons
  ++  json  (moons:enjs:lib mons)
  --
++  grab
  |%
  ++  noun  (map @p [=life =rift])
  ++  json  moons:dejs:lib
  --
++  grad  %mime
--
