/-  *treaty
/+  dock=docket, perms
|%
++  treaty-0-to-1  ::TODO  how safe/sane is this?
  |=  t=treaty-0:treaty
  t(docket [docket.t ~ ~])
::
++  update-0-to-1
  |=  u=update-0:treaty
  ?+  -.u  u
    %ini  [%ini (~(run by init.u) treaty-0-to-1)]
    %add  [%add (treaty-0-to-1 treaty-0.u)]
  ==
::
++  treaty-1-to-0
  |=  t=treaty
  ^-  treaty-0:treaty
  t(|4 &5.t)
::
++  update-1-to-0
  |=  u=update:treaty
  ^-  update-0:treaty
  ?+  -.u  u
    %ini  [%ini (~(run by init.u) treaty-1-to-0)]
    %add  [%add (treaty-1-to-0 treaty.u)]
  ==
::
++  scry-apps
  |=  [our=@p now=@da]
  ^-  (map desk @t)
  =/  our  (scot %p our)
  =/  now  (scot %da now)
  ?.  .^(? %gu /[our]/docket/[now]/$)  ~
  =+  .^(cup=charge-update:docket %gx /[our]/docket/[now]/charges/charge-update)
  ?>  ?=(%initial -.cup)
  %-  ~(run by initial.cup)
  |=(charge:docket title.docket)
::
++  make-passport
  |=  [our=@p now=@da =pers:gall desk=(unit desk)]
  ^-  passport:perms
  %.  pers
  %:  perm-tree:perms
    (scry-live:perms our now)
    (scry-apps our now)
    ?~(desk *pers:gall (scry-approved:perms our now u.desk))
  ==
::
++  enjs
  =,  enjs:format
  |%
  ++  merge
    |=  [a=json b=json]
    ^-  json
    ?>  &(?=(%o -.a) ?=(%o -.b))
    [%o (~(uni by p.a) p.b)]
  ::
  ++  treaty
    |=  t=^treaty
    %+  merge  (docket:enjs:dock docket.t)
    %-  pairs
    :~  ship+s+(scot %p ship.t)
        desk+s+desk.t
        cass+(case case.t)
        hash+s+(scot %uv hash.t)
        bill+a+(turn bill.t (lead %s))
        seal+(seal seal.t)
    ==
  ::
  ++  seal
      |=  pes=pers:gall
      ^-  json
      a+(turn ~(tap in pes) perm)
  ::
  ++  passport
    |=  =passport:perms
    ^-  json
    %-  pairs
    :~  ['rad' (perm-many rad.passport)]
        ['sys' (perm-many sys.passport)]
        ['any' (perm-many any.passport)]
        ['new' (perm-many new.passport)]
        :-  'app'
        :-  %a
        %+  turn  app.passport
        |=  [app=@t pes=perm-many:perms]
        ^-  json
        %-  pairs
        :~  ['app' s+app]
            ['pes' (perm-many pes)]
        ==
    ==
  ::
  ++  perm-many
    |=  many=perm-many:perms
    ^-  json
    a+(turn many perm-once)
  ::
  ++  perm-once
    |=  once=perm-once:perms
    ^-  json
    ?-  -.once
      %node  (frond 'node' (perm-node +.once))
      %kind  (frond 'kind' (perm-kind once))
    ==
  ::
  ++  perm-node
    |=  node=perm-node:perms
    ^-  json
    %-  pairs
    :~  ['desc' s+desc.node]
        ['warn' ?~(warn.node ~ s+u.warn.node)]
        ['have' s+have.node]
        ['pers' a+(turn ~(tap in pers.node) perm)]
    ==
  ::
  ++  perm-kind
    |=  kind=$>(%kind perm-once:perms)
    ^-  json
    %-  pairs
    :~  ['nom' s+nom.kind]
        ['pes' a+(turn ~(tap in pes.kind) perm-node)]
    ==
  ::
  ++  perm
    |=  p=perm:gall
    ^-  json
    ?:  ?=(?(%super %write %watch %reads %press) -.p)
      %-  pairs
      :~  ['vane' ~]
          ['name' [%s -.p]]
          :-  'tail'
          ?-    -.p
              %super  (pairs ~)
              %write
            (pairs ['jump' b+jump.p] ['dude' ?~(dude.p ~ s+dude.p)] ~)
          ::
              %watch
            %-  pairs
            :~  ['jump' b+jump.p]
                ['dude' ?~(dude.p ~ s+dude.p)]
                ['path' (path path.p)]
            ==
          ::
              %reads
            %-  pairs
            :~  ['vane' s+vane.p]
                ['care' ?~(care.p ~ s+u.care.p)]
                ['desk' ?~(desk.p ~ s+u.desk.p)]
                ['spur' (path spur.p)]
            ==
          ::
              %press
            %-  pairs
            :~  ['vane' ~]
                ['name' s+'press']
                ['tail' (frond 'spur' (path spur.p))]
            ==
          ==
      ==
    %-  pairs
    :~  ['vane' [%s -.p]]
        ['name' [%s ?@(+.p +.p +<.p)]]
        :-  'tail'
        ?-    p
            [%ames ?(%debug %block) *]                     (pairs ~)
            [%behn %timer]                                 (pairs ~)
            [%clay ?(%mount %creds %pulse) *]              (pairs ~)
            [%dill ?(%views %input %print %extra)]         (pairs ~)
            [%eyre ?(%serve %certs %perms)]                (pairs ~)
            [%gall %guard *]                               (pairs ~)
            [%iris %fetch]                                 (pairs ~)
            [%jael ?(%moons %prick %creak %login %break)]  (pairs ~)
            [%khan %tread]                                 (pairs ~)
            [%ames ?(%order %whack) *]
          %-  pairs
          :~  ['ship' ?~(ship.p ~ (ship u.ship.p))]
              ['path' (path path.p)]
          ==
        ::
            [%clay %label *]
          (frond 'desk' ?~(desk.p ~ s+u.desk.p))
        ::
            [%clay %write *]
          %-  pairs
          :~  ['desk' ?~(desk.p ~ s+u.desk.p)]
              ['spur' (path spur.p)]
          ==
        ::
            [%clay ?(%local %peers) *]
          %-  pairs
          :~  ['care' ?~(care.p ~ s+u.care.p)]
              ['desk' ?~(desk.p ~ s+u.desk.p)]
              ['spur' (path spur.p)]
          ==
        ::
            [%clay ?(%perms %plead %liven) *]
          (frond 'desk' ?~(desk.p ~ s+u.desk.p))
        ::
            [%clay %grave *]
          %-  pairs
          :~  ['ship' ?~(ship.p ~ (ship u.ship.p))]
              ['desk' ?~(desk.p ~ s+u.desk.p)]
          ==
        ::
            [%gall %clear *]
          (frond 'dude' ?~(dude.p ~ s+u.dude.p))
        ==
    ==
  ::
  ++  case
    |=  c=^case
    %+  frond  -.c
    ?-  -.c
      %da   s+(scot %da p.c)
      %tas  s+(scot %tas p.c)
      %ud   (numb p.c)
      %uv   s+(scot %uv p.c)
    ==
  ::
  ++  foreign-desk
    |=  [s=^ship =desk]
    ^-  cord
    (crip "{(scow %p s)}/{(trip desk)}")
  ::
  ++  alliance
    |=  a=^alliance
    ^-  json
    :-  %a
    %+  turn  ~(tap in a)
    |=  [=^ship =desk]
    ^-  json
    s+(foreign-desk ship desk)
  ::
  ++  treaty-update
    |=  u=update:^treaty
    ^-  json
    %+  frond  -.u
    ?-  -.u
      %add  (treaty treaty.u)
      %del  s+(foreign-desk +.u)
    ::
        %ini
      %-  pairs
      %+  turn  ~(tap by init.u)
      |=  [[s=^ship =desk] t=^treaty]
      [(foreign-desk s desk) (treaty t)]
    ==
  ::
  ++  ally-update
    |=  u=update:ally
    ^-  json
    %+  frond  -.u
    ?-  -.u
      ?(%add %del)  s+(scot %p ship.u)
    ::
        %ini
      %-  pairs
      %+  turn  ~(tap by init.u)
      |=  [s=^ship a=^alliance]
      [(scot %p s) (alliance a)]
    ::
        %new
      %-  pairs
      :~  ship+s+(scot %p ship.u)
          alliance+(alliance alliance.u)
      ==
    ==
  --
++  dejs
  =,  dejs:format
  |%
  ++  ship  (su ;~(pfix sig fed:ag))
  ++  ally-update
    ^-  $-(json update:ally)
    %-  of
    :~  add+ship
        del+ship
    ==
  ++  pers  (as perm)
  ++  perm
    |=  jon=json
    |^  ^-  perm:gall
    =/  dat=[vane=(unit @tas) name=@tas]  ((ot vane+(mu so) name+so ~) jon)
    ?+    dat  !!
        [[~ %behn] %timer]  [%behn %timer]
        [[~ %dill] %views]  [%dill %views]
        [[~ %dill] %input]  [%dill %input]
        [[~ %dill] %print]  [%dill %print]
        [[~ %dill] %extra]  [%dill %extra]
        [[~ %eyre] %serve]  [%eyre %serve]
        [[~ %eyre] %certs]  [%eyre %certs]
        [[~ %eyre] %perms]  [%eyre %perms]
        [[~ %iris] %fetch]  [%iris %fetch]
        [[~ %jael] %moons]  [%jael %moons]
        [[~ %jael] %prick]  [%jael %prick]
        [[~ %jael] %creak]  [%jael %creak]
        [[~ %jael] %login]  [%jael %login]
        [[~ %jael] %break]  [%jael %break]
        [[~ %khan] %tread]  [%khan %tread]
    ::
        [[~ %ames] %debug]  [%ames %debug ~]
        [[~ %ames] %block]  [%ames %block ~]
        [[~ %clay] %mount]  [%clay %mount ~]
        [[~ %clay] %creds]  [%clay %creds ~]
        [[~ %clay] %pulse]  [%clay %pulse ~]
        [[~ %gall] %guard]  [%gall %guard ~]
    ::
        [~ %super]      super+~
        [~ %press]      press+((ot tail+(ot spur+pa ~) ~) jon)
        [~ %write]
      write+((ot tail+(ot jump+bo dude+maybe-dude ~) ~) jon)
        [~ %watch]
      watch+((ot tail+(ot jump+bo dude+maybe-dude path+pa ~) ~) jon)
        [~ %reads]
      reads+((ot tail+(ot vane+so care+(mu so) desk+(mu so) spur+pa ~) ~) jon)
    ::
        [[~ %ames] %order]
      ames+order+((ot tail+(ot ship+(mu (su fed:ag)) path+pa ~) ~) jon)
        [[~ %ames] %whack]
      ames+whack+((ot tail+(ot ship+(mu (su fed:ag)) path+pa ~) ~) jon)
        [[~ %clay] %label]  clay+label+((ot tail+(ot desk+(mu so) ~) ~) jon)
        [[~ %clay] %write]
      clay+write+((ot tail+(ot desk+(mu so) spur+pa ~) ~) jon)
        [[~ %clay] %local]
      clay+local+((ot tail+(ot care+(mu so) desk+(mu so) spur+pa ~) ~) jon)
        [[~ %clay] %peers]
      clay+peers+((ot tail+(ot care+(mu so) desk+(mu so) spur+pa ~) ~) jon)
        [[~ %clay] %perms]  clay+perms+((ot tail+(ot desk+(mu so) ~) ~) jon)
        [[~ %clay] %plead]  clay+plead+((ot tail+(ot desk+(mu so) ~) ~) jon)
        [[~ %clay] %liven]  clay+liven+((ot tail+(ot desk+(mu so) ~) ~) jon)
        [[~ %clay] %grave]
      clay+grave+((ot tail+(ot ship+(mu (su fed:ag)) desk+(mu so) ~) ~) jon)
        [[~ %gall] %clear]
      gall+clear+((ot tail+(ot dude+(mu so) ~) ~) jon)
    ==
    ++  maybe-dude
      |=  jon=json
      ^-  ?(~ dude:gall)
      ?~  dud=(so:dejs-soft:format jon)
        (ul jon)
      u.dud
    --
  --
--

