/-  *ding
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
=|  state-0
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
  =+  !<  any=versioned-state  old
  =^  cards  state
    abet:gain:(abed any):load:hc
  [cards this]
  ::
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?>  =(our.bowl src.bowl)
  
  ?+    mark  (on-poke:def mark vase)
      %hark-action-2
    =+  !<  act=action  vase
    ?-    act
        [%create *]
      ?:  (~(has by all) id.act)  (on-poke:def mark vase)
      =/  n=notification  [unique +.act]
      =.  all  (~(put by all) id.act n)
      =.  unread  (put:on-id unread time.n id.n)
      =/  paths=(list path)  (origin-to-paths:hc origin.act) 
      :_  this
      [%give %fact paths hark-update+!>(`update`[%new n])]~
    ::
        [%read *]
      ?~  nut=(~(get by all) id.act)
        `this
      ?.  (has:on-id unread time.u.nut)
        `this
      =.  unread  +:(del:on-id unread time.u.nut)
      =.  read  (put:on-id read time.u.nut id.act)
      =/  paths=(list path)  (origin-to-paths:hc origin.u.nut)
      :_  this
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
      [cards this]
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
      [cards this]
    ==
  ==
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?>  =(our.bowl src.bowl)
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
  ?>  ?=([%x %'1' *] path)
  =>  .(path t.t.path)
  ?+    path  [~ ~]
      [%bundles %unread ~]
    :^  ~  ~  %ding-bundles
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
    :^  ~  ~  %ding-bundles
    !>  ^-  bundles
    =/  after=@da   (slav %da i.t.t.path)
    =/  max=@ud    (slav %ud i.t.t.t.path)
    %+  roll  (tab:on-id read `after max)
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
++  unique
  |-  ^-  @da
  ?.  |((has:on-id unread now.bowl) (has:on-id read now.bowl))
    now.bowl
  $(now.bowl (add now.bowl ~s1))
::
++  origin-to-paths
  |=  =origin
  ^-  (list path)
  =/  paths=(list path)
    :~  /desk/[des.origin]
        /all
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
::
++  load
  |_  [cards=(list card) any=versioned-state]
  ++  abed  |=(v=versioned-state load(any v))
  ++  abet  ?>(?=(%1 -.any) [(flop cards) `state-1`any])
  ++  emit  |=(=card load(cards [card cards]))
  ++  gain
    ?-  -.any
      %0  (state-0-to-1 any)
      %1  load
    ==
  ++  state-0-to-1
    |=  s0=state-0
    =|  s1=state-1
    =.  all.s1
      ^-  (map id notification)
      %-  ~(run by yarns.s0)
      |=  [=id:antique =yarn:antique]
      ^-  [^id notification]
      :-  id
      :*  tim.yarn
          id
          [des ted gop can]:rop.yarn
          con.yarn
          [%| `wer.yarn ~]
      ==
    |^
    =/  [u1=(list [time id] r1=(list [time id])]
      (~(val by groups.s0) rugger)
    =/  [u2=(list [time id] r2=(list [time id])]
      (~(val by desks.s0) rugger)
    =/  [u3=(list [time id] r3=(list [time id])]
      (rugger all.s0)
    =.  unread.s1  (gas:on-id unread.s1 u1)
    =.  unread.s1  (gas:on-id unread.s1 u2)
    =.  unread.s1  (gas:on-id unread.s1 u3)
    =.  read.s1  (gas:on-id read.s1 r1)
    =.  read.s1  (gas:on-id read.s1 r2)
    =.  read.s1  (gas:on-id read.s1 r3)
    =.  any  s1
    =.  load  (emit %pass /gc-kill %arvo %b %rest next-gc.s0]
    gain
    ::
    ++  rugger  |=(=rug:antique [(newer new.rug) (quilter qul.rug)])
    ++  newer
      |=  new=(map rope thread)
      ^-  (list [time id])
      %+  roll  ~(val by new)
      |=  [=thread:antique out=(list [time id])]
      =/  led=(list id)  ~(tap in thread)
      |-  ^-  (list [time id])
      ?~  led  out
      ?~  nut=(~(get by all.s1) i.led)
        $(led t.led)
      $(led t.led, out [[time.u.nut i.led] out])
    ::
    ++  quilter
      |=  qul=quilt:antique
      %+  roll  (tap:on:quilt:antique qul)
      |=  [[* =thread:antique] out=(list [time id])]
      =/  led=(list id)  ~(tap in thread)
      |-  ^-  (list [time id])
      ?~  led  out
      ?~  nut=(~(get by all.s1) i.led)
        $(led t.led)
      $(led t.led, out [[time.u.nut i.led] out])
    --
  --
--

