/-  *ding
/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0
  $:  %0
      all=(map id notification)
      unread=((mop time id) gte)
      read=((mop time id) gte)
  ==
+$  card  card:agent:gall
++  on-id  ((on time id) gte)
++  on-bu  ((on time notification) gte)
++  api-version  0
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
  |=  old-vase=vase
  ^-  (quip card _this)
  [~ this(state !<(state-0 old-vase))]
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?>  =(our.bowl src.bowl)
  ?>  ?=(%ding-action mark)
  =+  !<  act=action  vase
  ?-    act
      [%create *]
    ?:  (~(has by all) id.act)  (on-poke:def mark vase)
    =/  n=notification  [unique +.act]
    =.  all  (~(put by all) id.act n)
    =.  unread  (put:on-id unread time.n id.n)
    =/  paths=(list path)  (origin-to-paths:hc origin.act) 
    :_  this
    [%give %fact paths ding-update+!>(`update`[%new n])]~
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
    [%give %fact paths ding-update+!>(`update`act)]~
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
        [%give %fact paths ding-update+!>(`update`[%read q.i.del])]
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
      `[%give %fact paths ding-update+!>(`update`[%read id])]
    =.  read  (uni:on-id read unread)
    =.  unread  ~
    [cards this]
  ==
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?>  =(our.bowl src.bowl)
  ?>  ?=([%'0' *] path)
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
      `[%give %fact ~ ding-update+!>(`update`[%new u.got])]
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
      `[%give %fact ~ ding-update+!>(`update`[%new u.got])]
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
      `[%give %fact ~ ding-update+!>(`update`[%new u.got])]
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
      `[%give %fact ~ ding-update+!>(`update`[%new u.got])]
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
      `[%give %fact ~ ding-update+!>(`update`[%new u.got])]
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
  ?>  ?=([%x %'0' *] path)
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
--

