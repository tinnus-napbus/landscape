/-  d=ding
/+  groups-json
|%
++  on-bu  ((on time notification:d) gte)
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
        destination+(quri d)
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
  ++  quri
    |=  d=destination:d
    ^-  json
    ?:  -.d
      (frond ext+s+(crip (apex:en-purl:html d)))
    (frond int+s+(crip (apex:en-purl:html d)))
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
        destination+(quri destination.n)
    ==
  ::
  ++  bundles
    |=  =bundles:d
    %+  frond  %bundles
    :-  %a
    %+  turn  ~(tap by bundles)
    |=  [o=origin:d =bundle:d]
    %-  pairs
    :~  origin+(origin o)
        :*  %bundle
            %a
          %+  turn  (tap:on-bu bundle)
          |=  [t=@da n=notification:d]
          ^-  json
          %-  pairs 
          :~  time+(time t)
              notification+(notification n)
        ==
    ==  ==
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
    :~  
        read+(ot ~[id+(se %uv)])
        read-origin+org
        read-all+ul
        create+create-note
    ==
  ::
  ++  update
    (of update-tags)
  ::
  ++  update-tags
    :~  new+notification
        read+(ot ~[id+(se %uv)])
    ==
  ::
  ++  create-note
    %-  ot
    :~  id+(se %uv)
        origin+org
        contents+(ar content)
        destination+quri
    ==
  ::
  ++  org
    %-  ot
    :~  desk+so
        path+pa
        group+(mu flag)
        channel+(mu nest)
    ==
  ::
  ++  notification
    %-  ot
    :~  time+di
        id+(se %uv)
        origin+org
        contents+(ar content)
        destination+(+:quri)
    ==
  ::
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
  ++  quri
    %-  of 
    :~
      ext+(su zest:de-purl:html)
      int+(su zest:de-purl:html)
    ==
  --
--
