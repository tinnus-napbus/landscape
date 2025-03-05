/-  d=ding
/+  groups-json
|%
++  enjs
  =,  enjs:format
  |%
  ++  action
    |=  act=action:d
    %+  frond  -.act
    ?-  -.act
      %create       (create-act +.act)
      %read         (frond id+s+(scot %uv +.act))
      %read-origin  (origin +.act)
      %read-all     ~
    ==
  ++  create-act
    |=  [id=id:d o=origin:d c=contents:d d=destination:d]
    %-  pairs
    :~  id+s+(scot %uv id)
        origin+(origin o)
        contents+a+(turn c content)
        destination+quri
    ==
  ::
  ++  origin
    |=  o=origin:d
    %-  pairs
    :~  desk+s+des.o
        path+s+(spat pax.o)
        group+?~(gop.o ~ s/(flag u.gop.o))
        channel+?~(can.o ~ s/(nest u.can.o))
    ==
  ::
  ++  flag  flag:enjs:groups-json
  ++  nest  nest:enjs:groups-json
  ::
  ++  content
    |=  c=content:d
    ^-  json
    ?@  c  s/c
    ?-  -.c
      %ship  (frond ship+s+(scot %p p.c))
      %emph  (frond emph+s+p.c)
    ==
  ::
  ++  quri  ~
  ::
  ++  update
    |=  upd=update:d
    %+  frond  -.upd
      ?-  -.upd
        %new   (notification +.upd)
        %read  s+(scot %uv +.upd)
      ==
  ::
  ++  notification
    |=  n=notification:d
    %-  pairs
    :~  time+(time time.n)
        id+s+(scot %uv id.n)
        origin+(origin origin.n)
        contents+a+(turn contents.n content)
        destination+quri
    ==
  --
::
++  dejs
  =,  dejs:format
  |%
  ++  action
    ^-  $-(json action:d)
    (of action-tags)
  ::
  ++  action-tags
    :~  create+create
        read+(ot ~[id+(se %uv)])
        read-origin+origin
        read-all+ul
    ==
  ::
  ++  create
    %-  ot
    :~  id+(se %uv)
        origin+origin
        contents+(ar content)
        destination+quri
    ==
  ::
  ++  origin 
    %-  ot
    :~  desk+(se %tas)
        path+pa
        group+(mu flag)
        channel+(mu nest)
    ==
  ++  flag  flag:dejs:groups-json
  ++  nest  nest:dejs:groups-json
  ++  ship  ship:dejs:groups-json
  ::
  ++  content
    |=  j=json
    ^-  content:d
    ?:  ?=([%s *] j)  p.j
    =>  .(j `json`j)
    %.  j
    %-  of
    :~  ship+ship
        emph+so
    ==
  ::
  ++  quri  ul
  ::
  --
--