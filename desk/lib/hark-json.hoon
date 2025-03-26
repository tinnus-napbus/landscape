/-  h=hark
/+  groups-json
|%
++  enjs
  =,  enjs:format
  |%
  ++  action
    |=  a=action:antique:h
    %+  frond  -.a
    ?-  -.a
      %add-yarn  (add-yarn +.a)
      %saw-seam  (seam +.a)
      %saw-rope  (rope +.a)
    ==
  ::
  ++  blanket
    |=  b=blanket:antique:h
    %-  pairs
    :~  seam/(seam seam.b)
        yarns/(yarns yarns.b)
        quilt/(quilt quilt.b)
    ==
  ::
  ++  quilt
    |=  q=quilt:antique:h
    %-  pairs
    %+  turn  (tap:on:quilt:antique:h q)
    |=  [num=@ud t=thread:antique:h]
    [(scot %ud num) (thread t)]
  ::
  ++  add-yarn
    |=  [all=? desk=? yar=yarn:antique:h]
    %-  pairs
    :~  all/b/all
        desk/b/desk
        yarn/(yarn yar)
    ==
  ::
  ++  carpet
    |=  c=carpet:antique:h
    ^-  json
    %-  pairs
    :~  seam/(seam seam.c)
        yarns/(yarns yarns.c)
        cable/(cable cable.c)
        stitch/(numb stitch.c)
    ==
  ::
  ++  cable
    |=  c=(map rope:antique:h thread:antique:h)
    ^-  json
    :-  %a
    %+  turn  ~(tap by c)
    |=  [r=rope:antique:h t=thread:antique:h]
    %-  pairs
    :~  rope/(rope r)
        thread/(thread t)
    ==
  ::
  ++  skeins
    |=  sks=(list skein:antique:h)
    ^-  json
    :-  %a
    %+  turn  sks
    |=  =skein:antique:h
    %-  pairs
    :~  time/(time time.skein)
        count/(numb count.skein)
        ship-count/(numb ship-count.skein)
        top/(yarn top.skein)
        unread/b/unread.skein
    ==
  ++  id
    |=  i=id:antique:h
    ^-  json
    s/(scot %uv i)
  ::
  ++  thread
    |=  t=thread:antique:h
    ^-  json
    :-  %a
    (turn ~(tap in t) id)
  ::
  ++  threads
    |=  ts=(map @da thread:antique:h)
    %-  pairs
    %+  turn  ~(tap by ts)
    |=  [tim=@da t=thread:antique:h]
    ^-  [cord json]
    [(scot %da tim) (thread t)]
  ::
  ++  update
    |=  u=update:antique:h
    %-  pairs
    :~  yarns/(yarns yarns.u)
        seam/(seam seam.u)
        threads/(threads threads.u)
    ==
  ::
  ++  yarns
    |=  ys=(map id:antique:h yarn:antique:h)
    ^-  json
    %-  pairs
    %+  turn  ~(tap by ys)
    |=  [i=id:antique:h y=yarn:antique:h]
    [(scot %uv i) (yarn y)]
  ::
  ++  yarn
    |=  y=yarn:antique:h
    ^-  json
    %-  pairs
    :~  id/s/(scot %uv id.y)
        rope/(rope rop.y)
        time/(time tim.y)
        con/a/(turn con.y content)
        wer/s/(spat wer.y)
        button/~
    ==
  ::
  ++  content
    |=  c=content:antique:h
    ^-  json
    ?@  c  s/c
    ?-  -.c
      %ship  (frond ship/s/(scot %p p.c))
      %emph  (frond emph/s/p.c)
    ==
  ::
  ++  seam
    |=  s=seam:antique:h
    %+  frond  -.s
    ^-  json
    ?-  -.s
      %all    ~
      %group  s/(flag flag.s)
      %desk   s/desk.s
    ==
  ::
  ++  flag  flag:enjs:groups-json
  ++  nest  nest:enjs:groups-json
  ::
  ++  rope
    |=  r=rope:antique:h
    ^-  json
    %-  pairs
    :~  group/?~(gop.r ~ s/(flag u.gop.r))
        channel/?~(can.r ~ s/(nest u.can.r))
        desk/s/des.r
        thread/s/(spat ted.r)
    ==
  --
::
++  dejs
  =,  dejs:format
  |%
  ++  action-tags
    :~  saw-seam/seam
        saw-rope/rope
        add-yarn/add-yarn
    ==
  ++  action
    ^-  $-(json action:antique:h)
    (of action-tags)
  ::
  ++  action-1
    ^-  $-(json action-1:antique:h)
    (of new-yarn/new-yarn action-tags)
  ::
  ++  seam
    %-  of
    :~  all/ul
        desk/so
        group/flag
    ==
  ::
  ++  add-yarn
    %-  ot
    :~  all/bo
        desk/bo
        yarn/yarn
    ==
  ::
  ++  new-yarn
    %-  ot
    :~  all/bo
        desk/bo
        rope/rope
        con/(ar content)
        wer/pa
        but/(mu button)
    ==
  ::
  ++  button
    %-  ot
    :~  title/so
        hanlder/pa
    ==
  ::
  ++  content
    |=  j=json
    ^-  content:antique:h
    ?:  ?=([%s *] j)  p.j
    =>  .(j `json`j)
    %.  j
    %-  of
    :~  ship/ship
        emph/so
    ==
  ::
  ++  yarn
    %-  ot
    :~  id/(se %uvh)
        rope/rope
        time/(se %da)
        con/(ar content)
        wer/pa
        but/(mu button)
    ==
  ::
  ++  flag  flag:dejs:groups-json
  ++  nest  nest:dejs:groups-json
  ++  ship  ship:dejs:groups-json
  ++  rope
    %-  ot
    :~  group/(mu flag)
        channel/(mu nest)
        desk/so
        thread/pa
    ==
  --
--
