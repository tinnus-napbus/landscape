/-  *hark
/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
      state-1
  ==
+$  state-1
  $:  %1
      all=(map id notification)
      unread=((mop time id) gte)
      read=((mop time id) gte)
  ==
+$  state-0
  $:  %0
      yarns=(map id:antique yarn:antique)
      groups=(map flag:antique rug:antique)
      desks=(map desk rug:antique)
      all=rug:antique
      next-gc=@da
  ==
+$  card  card:agent:gall
++  on-id  ((on time id) gte)
++  on-bu  ((on time notification) gte)
++  api-version  1
--
::
%-  agent:dbug
=|  state-1
=*  state  -
^-  agent:gall
=<
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
    hc    ~(. +> bowl)
++  on-init  on-init:def
++  on-save  !>(state)
++  on-load
  |=  old=vase
  ^-  (quip card _this)
  =+  !<  vs=versioned-state  old
  =^  cards  state
    =,  load:hc
    abet:gain:(abed vs)
  [cards this]
::
++  on-poke
  |=  [=mark =vase]
  |^  ^-  (quip card _this)
  ?>  =(our.bowl src.bowl)
  =^  cards  state
    ?+  mark  (on-poke:def mark vase)
      %hark-action-2  (hark-action-2 !<(action vase))
      %hark-action-1  (hark-action-1 !<(action-1:antique vase))
      %hark-action    (hark-action !<(action:antique vase))
    ==
  [cards this]
  ::
  ++  hark-action-2
    |=  act=action
    ^-  (quip card _state)
    ?-    act
        [%create *]
      ?:  (~(has by all) id.act)  (on-poke:def mark vase)
      =/  n=notification  [unique:hc +.act]
      =.  all  (~(put by all) id.act n)
      =.  unread  (put:on-id unread time.n id.n)
      =/  paths=(list path)  (origin-to-paths:hc origin.act) 
      :_  state
      [%give %fact paths hark-update+!>(`update`[%new n])]~
    ::
        [%read *]
      ?~  nut=(~(get by all) id.act)
        `state
      ?.  (has:on-id unread time.u.nut)
        `state
      =.  unread  +:(del:on-id unread time.u.nut)
      =.  read  (put:on-id read time.u.nut id.act)
      =/  paths=(list path)  (origin-to-paths:hc origin.u.nut)
      :_  state
      [%give %fact paths hark-update+!>(`update`act)]~
    ::
        [%read-origin *]
      =^  del=(list (pair time id))  unread
        %^  (dip:on-id (list (pair time id)))  unread  ~
        |=  [del=(list (pair time id)) =time =id]
        ^-  [(unit ^id) ? (list (pair ^time ^id))]
        ?~  got=(~(get by all) id)
          [~ | del]
        ?.  (match-origin:hc origin.act origin.u.got)
          [`id | del]
        [~ | [time id] del]
      =.  read  (gas:on-id read del)
      =/  cards=(list card)
        =|  cards=(list card)
        |-  ^-  (list card)
        ?~  del
          cards
        ?~  got=(~(get by all) q.i.del)
          $(del t.del)
        =/  =card
          =/  paths=(list path)  (origin-to-paths:hc origin.u.got)
          [%give %fact paths hark-update+!>(`update`[%read q.i.del])]
        $(del t.del, cards [card cards])
      [cards state]
    ::
        [%read-all ~]
      =/  cards=(list card)
        %+  murn  (tap:on-id unread)
        |=  [=time =id]
        ^-  (unit card)
        ?~  got=(~(get by all) id)
          ~
        =/  paths=(list path)  (origin-to-paths:hc origin.u.got)
        `[%give %fact paths hark-update+!>(`update`[%read id])]
      =.  read  (uni:on-id read unread)
      =.  unread  ~
      [cards state]
    ==
  ::
  ++  hark-action-1
    |=  act=action-1:antique
    ^-  (quip card _state)
    ?-    -.act
        %add-yarn  (hark-action `action:antique`act)
        %saw-seam  (hark-action `action:antique`act)
        %saw-rope  (hark-action `action:antique`act)
        %new-yarn
      =/  =action
        :*  %create
            (end [7 1] (shax eny.bowl))
            [des ted gop can]:rop.act
            con.act
            [%| `wer.act ~]
        ==
      (hark-action-2 action)
    ==
  ::
  ++  hark-action
    |=  act=action:antique
    ^-  (quip card _state)
    ?-    -.act
        %add-yarn
      =/  =action
        :*  %create
            id.yarn.act
            [des ted gop can]:rop.yarn.act
            con.yarn.act
            [%| `wer.yarn.act ~]
        ==
      (hark-action-2 action)
    ::
        %saw-seam
      =/  =action
        ?-    -.seam.act
            %desk   [%read-origin desk.seam.act / ~ ~]
            %group  [%read-origin %tlon ~ `flag.seam.act ~]
            %all    [%read-all ~]
        ==
      (hark-action-2 action)
    ::
        %saw-rope
      =/  =action  [%read-origin des ted gop can]:rope.act
      (hark-action-2 action)
    ==
  --
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?>  =(our.bowl src.bowl)
  ::  versioned: must be /1/...
  ?>  ?=([%'1' *] path)
  =>  .(path t.path)
  ?+    path  (on-watch:def path)
      [%all ~]            `this
      [%desk @ ~]         `this
      [%path @ @ *]       `this
      [%group @ @ ~]      `this
      [%channel @ @ @ ~]  `this
      [%init *]
    =>  .(path t.path)
    ?+    path  (on-watch:def path)
        [%all ~]
      :_  this
      %+  murn  (tap:on-id unread)
      |=  [=time =id]
      ^-  (unit card)
      ?~  got=(~(get by all) id)
        ~
      `[%give %fact ~ hark-update+!>(`update`[%new u.got])]
    ::
        [%desk @ ~]
      =/  =desk  i.t.path
      :_  this
      %+  murn  (tap:on-id unread)
      |=  [=time =id]
      ^-  (unit card)
      ?~  got=(~(get by all) id)
        ~
      ?.  =(desk des.origin.u.got)
        ~
      `[%give %fact ~ hark-update+!>(`update`[%new u.got])]
    ::
        [%path @ @ *]
      =/  =desk  i.t.path
      =/  pax=^path  t.t.path
      :_  this
      %+  murn  (tap:on-id unread)
      |=  [=time =id]
      ^-  (unit card)
      ?~  got=(~(get by all) id)
        ~
      ?.  ?&  =(desk des.origin.u.got)
              =(pax pax.origin.u.got)
          ==
        ~
      `[%give %fact ~ hark-update+!>(`update`[%new u.got])]
    ::
        [%group @ @ ~]
      =/  =ship  (slav %p i.t.path)
      =/  name=term  i.t.t.path
      :_  this
      %+  murn  (tap:on-id unread)
      |=  [=time =id]
      ^-  (unit card)
      ?~  got=(~(get by all) id)
        ~
      ?~  gop.origin.u.got
        ~
      ?.  ?&  =(ship p.u.gop.origin.u.got)
              =(name q.u.gop.origin.u.got)
          ==
        ~
      `[%give %fact ~ hark-update+!>(`update`[%new u.got])]
    ::
        [%channel @ @ @ ~]
      =/  app=term  i.t.path
      =/  =ship  (slav %p i.t.t.path)
      =/  name=term  i.t.t.t.path
      :_  this
      %+  murn  (tap:on-id unread)
      |=  [=time =id]
      ^-  (unit card)
      ?~  got=(~(get by all) id)
        ~
      ?~  can.origin.u.got
        ~
      ?.  =([~ app ship name] can.origin.u.got)
        ~
      `[%give %fact ~ hark-update+!>(`update`[%new u.got])]
    ==
  ==
::
++  on-agent  on-agent:def
++  on-leave  on-leave:def
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?:  ?=([%x %api-version ~] path)
    ``atom+!>(api-version)
  :: versioned: must be /x/1/...
  ?>  ?=([%x %'1' *] path)
  =>  .(path t.t.path)
  ?+    path  [~ ~]
      [%bundles %unread ~]
    :^  ~  ~  %hark-bundles
    !>  ^-  bundles
    %+  roll  (tap:on-id unread)
    |=  [[=time =id] =bundles]
    ?~  got=(~(get by all) id)
      bundles
    ?~  b-got=(~(get by bundles) origin.u.got)
      (~(put by bundles) origin.u.got (put:on-bu *bundle time u.got))
    (~(put by bundles) origin.u.got (put:on-bu u.b-got time u.got))
  ::
      [%bundles %read @ @ ~]
    :^  ~  ~  %hark-bundles
    !>  ^-  bundles
    =/  after=(unit @da)  (di:dejs-soft:format [%n p=i.t.t.path])
    =/  max=@ud    (slav %ud i.t.t.t.path)
    %+  roll  (tab:on-id read after max)
    |=  [[=time =id] =bundles]
    ?~  got=(~(get by all) id)
      bundles
    ?~  b-got=(~(get by bundles) origin.u.got)
      (~(put by bundles) origin.u.got (put:on-bu *bundle time u.got))
    (~(put by bundles) origin.u.got (put:on-bu u.b-got time u.got))
  ==
++  on-arvo  on-arvo:def
++  on-fail  on-fail:def
--
::
|_  =bowl:gall
::  +unique: generate a unique timestamp
::
++  unique
  |-  ^-  @da
  ?.  |((has:on-id unread now.bowl) (has:on-id read now.bowl))
    now.bowl
  $(now.bowl (add now.bowl ~s1))
::  +origin-to-paths: generate watch paths for facts for origin
::
++  origin-to-paths
  |=  =origin
  ^-  (list path)
  =/  paths=(list path)
    :~  /desk/[des.origin]
        /1/all
    ==
  =?  paths  ?=(^ pax.origin)
    :_  paths  [%path des.origin pax.origin]
  =?  paths  ?=(^ gop.origin)
    :_  paths  [%group (scot %p p.u.gop.origin) q.u.gop.origin ~]
  =?  paths  ?=(^ can.origin)
    :_  paths
    :~  %channel
        p.u.can.origin
        (scot %p p.q.u.can.origin)
        q.q.u.can.origin
    ==
  paths
::  +match-origin: see if origin ref (a) encompasses (b)
::    empty pax selects all pax
::    null group selects all groups
::    null channel selects all channels
::
++  match-origin
  |=  [a=origin b=origin]
  ^-  ?
  ?.  =(des.a des.b)
    |
  ?.  |(=(~ pax.a) =(pax.a pax.b))
    |
  ?:  =(~ gop.a)
    ?:  =(~ can.a)
      &
    =(can.a can.b)
  ?:  =(~ can.a)
    =(gop.a gop.b)
  ?&  =(can.a can.b)
      =(gop.a gop.b)
  ==
::  +load: handle any state transitions
::    abet:gain:(abed any):load:hc
++  load
  |_  [cards=(list card) any=versioned-state]
  ++  abed  
  |=(v=versioned-state this(any v))
  ++  abet  ?>(?=(%1 -.any) [(flop cards) `state-1`any])
  ++  emit  |=(=card this(cards [card cards]))
  ++  this  .
  ++  gain
    ?-  -.any
      %0  (state-0-to-1 any)
      %1  this
    ==
  ++  state-0-to-1
    |=  s0=state-0
    =|  s1=state-1
    ::  convert yarn map to notification map
    =.  all.s1
      ^-  (map id notification)
      %-  ~(urn by yarns.s0)
      |=  [=id:antique =yarn:antique]
      ^-  notification
      :*  tim.yarn
          id
          [des ted gop can]:rop.yarn
          con.yarn
          [%| `wer.yarn ~]
      ==
    ::  convert reads & unreads
    |^
    =/  [u=(list [time id]) r=(list [time id])]
      (merge-rugs groups.s0 desks.s0 all.s0)
    =.  +>.s1
      [(gas:on-id unread u) (gas:on-id read u)]
    =.  this
      (emit %pass /gc-kill %arvo %b %rest next-gc.s0)
    gain
    ::  +merge-rugs: merge rugs & convert to time-id pair lists
    ::
    ++  merge-rugs
      |=  [a=(map flag rug:antique) b=(map desk rug:antique) c=rug:antique]
      ^-  [(list [time id]) (list [time id])]
      =/  rugs=(list rug:antique)  [c (weld ~(val by a) ~(val by b))]
      =/  [uid=(set id) rid=(set id)]
        %+  roll  rugs
        |=  [=rug:antique uid=(set id) rid=(set id)]
        :-  %+  roll  ~(val by new.rug)
            |:  [ted=*thread:antique uid]
            (~(uni in uid) ted)
        %+  roll  (tap:on:quilt:antique qul.rug)
        |:  [[*@ud ted=*thread:antique] rid]
        (~(uni in uid) ted)
      :-  %+  murn  ~(tap in uid)
          |=  =id
          ^-  (unit [time ^id])
          ?~  nut=(~(get by all.s1) id)
            ~
          `[time.u.nut id]
      %+  murn  ~(tap in uid)
      |=  =id
      ^-  (unit [time ^id])
      ?~  nut=(~(get by all.s1) id)
        ~
      `[time.u.nut id]
    --
  --
--

