/-  h=hark
|%
++  on-bu  ((on time notification:h) gte)
++  enjs
  =,  enjs:format
  |%
  ++  action
    |=  act=action:h
    %+  frond  -.act
    ?-  -.act
      %create       (create-act +.act)
      %read         (frond id+s+(scot %uv +.act))
      %read-origin  (origin +.act)
      %read-all     ~
    ==
  ++  create-act
    |=  [id=id:h o=origin:h c=contents:h d=destination:h]
    %-  pairs
    :~  id+s+(scot %uv id)
        origin+(origin o)
        contents+a+(turn c content)
        destination+(quri d)
    ==
  ::
  ++  origin
    |=  o=origin:h
    %-  pairs
    :~  desk+s+des.o
        path+s+(spat pax.o)
        group+?~(gop.o ~ s/(flag u.gop.o))
        channel+?~(can.o ~ s/(nest u.can.o))
    ==
  ::
  ++  flag
    |=  f=flag:h
    (rap 3 (scot %p p.f) '/' q.f ~)
  ::
  ++  nest
    |=  n=nest:h
    (rap 3 p.n '/' (flag q.n) ~)
  ::
  ++  content
    |=  c=content:h
    ^-  json
    ?@  c  s/c
    ?-  -.c
      %ship  (frond ship+s+(scot %p p.c))
      %emph  (frond emph+s+p.c)
    ==
  ::
  ++  quri
    |=  d=destination:h
    ^-  json
    ?:  -.d
      (frond ext+s+(crip (apex:en-purl:html d)))
    (frond int+s+(crip (apex:en-purl:html d)))
  ::
  ++  update
    |=  upd=update:h
    %+  frond  -.upd
      ?-  -.upd
        %new   (notification +.upd)
        %read  s+(scot %uv +.upd)
      ==
  ::
  ++  notification
    |=  n=notification:h
    %-  pairs
    :~  time+s+(scot %da time.n)
        id+s+(scot %uv id.n)
        origin+(origin origin.n)
        contents+a+(turn contents.n content)
        destination+(quri destination.n)
    ==
  ::
  ++  bundles
    |=  =bundles:h
    %+  frond  %bundles
    :-  %a
    %+  turn  ~(tap by bundles)
    |=  [o=origin:h =bundle:h]
    %-  pairs
    :~  origin+(origin o)
        :*  %bundle
            %a
          %+  turn  (tap:on-bu bundle)
          |=  [t=@da n=notification:h]
          ^-  json
          %-  pairs 
          :~  time+s+(scot %da time.n)
              notification+(notification n)
        ==
    ==  ==
  --
::
++  dejs
  =,  dejs:format
  |%
  ++  action
    ^-  $-(json action:h)
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
    :~  time+(se %da)
        id+(se %uv)
        origin+org
        contents+(ar content)
        destination+(+:quri)
    ==
  ::
  ++  flag  (su ;~((glue fas) ;~(pfix sig fed:ag) sym))
  ++  nest  (su ;~((glue fas) sym ;~(pfix sig fed:ag) sym))
  ++  ship  (se %p)
  ::
  ++  content
    |=  j=json
    ^-  content:h
    ?:  ?=([%s *] j)  p.j
    =>  .(j `json`j)
    %.  j
    %-  of
    :~  ship+ship
        emph+so
    ==
  ::
  ++  quri
  %+  cu  tail
    %-  of 
    :~
      ext+(su zest:de-purl:html)
      int+(su zest:de-purl:html)
    ==
  --
--
