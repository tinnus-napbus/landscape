/-  *treaty
/+  dock=docket
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
    |=  =pers:gall
    ^-  json
    a+(turn (sort ~(tap in pers) aor) perm)
  ::
  ++  perm
    |=  p=perm:gall
    ^-  json
    ?-    p
        [%super *]
      %-  pairs
      :~  ['vane' ~]
          ['name' s+'super']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%write *]
      %-  pairs
      :~  ['vane' ~]
          ['name' s+'write']
          ['hoon' s+(crip <p>)]
          :-  'tail'
          %-  pairs
          :~  ['jump' b+jump.p]
              ['dude' ?~(dude.p ~ s+dude.p)]
      ==  ==
    ::
        [%watch *]
      %-  pairs
      :~  ['vane' ~]
          ['name' s+'watch']
          ['hoon' s+(crip <p>)]
          :-  'tail'
          %-  pairs
          :~  ['jump' b+jump.p]
              ['dude' ?~(dude.p ~ s+dude.p)]
              ['path' (path path.p)]
      ==  ==
    ::
        [%reads *]
      %-  pairs
      :~  ['vane' ~]
          ['name' s+'reads']
          ['hoon' s+(crip <p>)]
          :-  'tail'
          %-  pairs
          :~  ['vane' s+vane.p]
              ['care' ?~(care.p ~ s+u.care.p)]
              ['desk' ?~(desk.p ~ s+u.desk.p)]
              ['spur' (path spur.p)]
      ==  ==
    ::
        [%press *]
      %-  pairs
      :~  ['vane' ~]
          ['name' s+'press']
          ['hoon' s+(crip <p>)]
          ['tail' (frond 'spur' (path spur.p))]
      ==
    ::
        [%ames %debug *]
      %-  pairs
      :~  ['vane' s+'ames']
          ['name' s+'debug']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%ames %block *]
      %-  pairs
      :~  ['vane' s+'ames']
          ['name' s+'block']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%ames %order *]
      %-  pairs
      :~  ['vane' s+'ames']
          ['name' s+'order']
          ['hoon' s+(crip <p>)]
          :-  'tail'
          %-  pairs
          :~  ['ship' ?~(ship.p ~ (ship u.ship.p))]
              ['path' (path path.p)]
      ==  ==
    ::
        [%ames %whack *]
      %-  pairs
      :~  ['vane' s+'ames']
          ['name' s+'whack']
          ['hoon' s+(crip <p>)]
          :-  'tail'
          %-  pairs
          :~  ['ship' ?~(ship.p ~ (ship u.ship.p))]
              ['path' (path path.p)]
      ==  ==
    ::
        [%behn %timer]
      %-  pairs
      :~  ['vane' s+'behn']
          ['name' s+'timer']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%clay %mount *]
      %-  pairs
      :~  ['vane' s+'clay']
          ['name' s+'mount']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%clay %creds *]
      %-  pairs
      :~  ['vane' s+'clay']
          ['name' s+'creds']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%clay %label *]
      %-  pairs
      :~  ['vane' s+'clay']
          ['name' s+'label']
          ['hoon' s+(crip <p>)]
          ['tail' (frond 'desk' ?~(desk.p ~ s+u.desk.p))]
      ==
    ::
        [%clay %write *]
      %-  pairs
      :~  ['vane' s+'clay']
          ['name' s+'write']
          ['hoon' s+(crip <p>)]
          :-  'tail'
          %-  pairs
          :~  ['desk' ?~(desk.p ~ s+u.desk.p)]
              ['spur' (path spur.p)]
      ==  ==
    ::
        [%clay %local *]
      %-  pairs
      :~  ['vane' s+'clay']
          ['name' s+'local']
          ['hoon' s+(crip <p>)]
          :-  'tail'
          %-  pairs
          :~  ['care' ?~(care.p ~ s+u.care.p)]
              ['desk' ?~(desk.p ~ s+u.desk.p)]
              ['spur' (path spur.p)]
      ==  ==
    ::
        [%clay %peers *]
      %-  pairs
      :~  ['vane' s+'clay']
          ['name' s+'peers']
          ['hoon' s+(crip <p>)]
          :-  'tail'
          %-  pairs
          :~  ['care' ?~(care.p ~ s+u.care.p)]
              ['desk' ?~(desk.p ~ s+u.desk.p)]
              ['spur' (path spur.p)]
      ==  ==
    ::
        [%clay %perms *]
      %-  pairs
      :~  ['vane' s+'clay']
          ['name' s+'perms']
          ['hoon' s+(crip <p>)]
          ['tail' (frond 'desk' ?~(desk.p ~ s+u.desk.p))]
      ==
    ::
        [%clay %plead *]
      %-  pairs
      :~  ['vane' s+'clay']
          ['name' s+'plead']
          ['hoon' s+(crip <p>)]
          ['tail' (frond 'desk' ?~(desk.p ~ s+u.desk.p))]
      ==
    ::
        [%clay %liven *]
      %-  pairs
      :~  ['vane' s+'clay']
          ['name' s+'liven']
          ['hoon' s+(crip <p>)]
          ['tail' (frond 'desk' ?~(desk.p ~ s+u.desk.p))]
      ==
    ::
        [%clay %pulse *]
      %-  pairs
      :~  ['vane' s+'clay']
          ['name' s+'pulse']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%clay %grave *]
      %-  pairs
      :~  ['vane' s+'clay']
          ['name' s+'grave']
          ['hoon' s+(crip <p>)]
          :-  'tail'
          %-  pairs
          :~  ['ship' ?~(ship.p ~ (ship u.ship.p))]
              ['desk' ?~(desk.p ~ s+u.desk.p)]
      ==  ==
    ::
        [%dill %views]
      %-  pairs
      :~  ['vane' s+'dill']
          ['name' s+'views']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%dill %input]
      %-  pairs
      :~  ['vane' s+'dill']
          ['name' s+'input']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%dill %print]
      %-  pairs
      :~  ['vane' s+'dill']
          ['name' s+'print']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%dill %extra]
      %-  pairs
      :~  ['vane' s+'dill']
          ['name' s+'extra']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%eyre %serve]
      %-  pairs
      :~  ['vane' s+'eyre']
          ['name' s+'serve']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%eyre %certs]
      %-  pairs
      :~  ['vane' s+'eyre']
          ['name' s+'certs']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%eyre %perms]
      %-  pairs
      :~  ['vane' s+'eyre']
          ['name' s+'perms']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%gall %clear *]
      %-  pairs
      :~  ['vane' s+'gall']
          ['name' s+'clear']
          ['hoon' s+(crip <p>)]
          ['tail' (frond 'dude' ?~(dude.p ~ s+u.dude.p))]
      ==
    ::
        [%gall %guard *]
      %-  pairs
      :~  ['vane' s+'gall']
          ['name' s+'guard']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%iris %fetch]
      %-  pairs
      :~  ['vane' s+'iris']
          ['name' s+'fetch']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%jael %moons]
      %-  pairs
      :~  ['vane' s+'jael']
          ['name' s+'moons']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%jael %prick]
      %-  pairs
      :~  ['vane' s+'jael']
          ['name' s+'prick']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%jael %creak]
      %-  pairs
      :~  ['vane' s+'jael']
          ['name' s+'creak']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%jael %login]
      %-  pairs
      :~  ['vane' s+'jael']
          ['name' s+'login']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%jael %break]
      %-  pairs
      :~  ['vane' s+'jael']
          ['name' s+'break']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
      ==
    ::
        [%khan %tread]
      %-  pairs
      :~  ['vane' s+'khan']
          ['name' s+'tread']
          ['hoon' s+(crip <p>)]
          ['tail' (pairs ~)]
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
  --
--

