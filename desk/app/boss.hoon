/-  *boss, dns
/+  default-agent, dbug, naive
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0
  $:  %0
    moons=(map @p [=life =rift key=@uw])
    pokes=[all=(set @tas) black=(set @tas)]
  ==
+$  card  card:agent:gall
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
    cor    ~(. +> [bowl ~])
++  on-init
  ^-  (quip card _this)
  =.  pokes
    :_  ~
    %-  silt
    ^-  (list @tas)
    :~  %boss-pack
        %boss-meld
        %boss-exit
        %boss-snub
        %boss-snob
        %boss-moon
        %boss-moon-rekey
        %boss-moon-breach
        %boss-dns-config
    ==
  `this
::
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
  ?<  (~(has in black.pokes) mark)
  =^  cards=(list card)  state
    =<  abet
    ?+  mark  (on-poke:def mark vase)
      %boss-pack         =;(f (f !<(_+<.f vase)) pack:poke:cor)
      %boss-meld         =;(f (f !<(_+<.f vase)) meld:poke:cor)
      %boss-exit         =;(f (f !<(_+<.f vase)) exit:poke:cor)
      %boss-snub         =;(f (f !<(_+<.f vase)) snub:poke:cor)
      %boss-snob         =;(f (f !<(_+<.f vase)) snob:poke:cor)
      %boss-moon         =;(f (f !<(_+<.f vase)) moon:poke:cor)
      %boss-moon-rekey   =;(f (f !<(_+<.f vase)) moon-rekey:poke:cor)
      %boss-moon-breach  =;(f (f !<(_+<.f vase)) moon-breach:poke:cor)
      %boss-dns-config   =;(f (f !<(_+<.f vase)) dns-config:poke:cor)
      %boss-poke-block   =;(f (f !<(_+<.f vase)) poke-block:poke:cor)
    ==
  [cards this]
::
++  on-watch  on-watch:def
::
++  on-arvo
  |=  [=wire sign=sign-arvo]
  ^-  (quip card _this)
  =^  cards  state
    =<  abet
    ?+    wire  cor
        [%jael %pubkey @ ~]
      =/  =ship  (slav %p i.t.t.wire)
      ?.  ?=([%jael %public-keys *] sign)
        cor
      (pubkey:arvo:cor ship public-keys-result.sign)
    ==
  [cards this]

++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?>  ?=([%x %'0' *] path)
  =>  .(path t.t.path)
  ?+  path  (on-peek:def path)
    [%our ~]           ``boss-our+!>(our.bowl)
    [%our-info ~]      our-info:peek:cor
    [%sys-info ~]      sys-info:peek:cor
    [%moons ~]         moons:peek:cor
    [%moonkey @ ~]     (moonkey:peek:cor (slav %p i.t.path))
    [%agent-desk @ ~]  (agent-desk:peek:cor i.t.path)
    [%http-ports ~]    http-ports:peek:cor
    [%blocks ~]        blocks:peek:cor
    [%domains ~]       domains:peek:cor
    [%allowed ~]       allowed:peek:cor
  ==

++  on-agent  on-agent:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
::
|_  [=bowl:gall cards=(list card)]
++  abet  [(flop cards) state]
++  cor  .
++  emit  |=(=card cor(cards [card cards]))
++  beaker  |=(=desk `beak`[our.bowl desk da+now.bowl])
++  moonkey
  |=  [mon=@p life=@ rift=@]
  ^-  (pair pass @uw)
  =/  cub  (pit:nu:crub:crypto 512 (shaz (jam mon life eny.bowl)))
  =/  =feed:jael  [[%1 ~] mon [life sec:ex:cub]~]
  [pub:ex:cub (jam feed)]
::
++  poke
  |%
  ++  pack  |=(~ (emit %pass /poke/pack %arvo %d %pack ~))
  ++  meld  |=(~ (emit %pass /poke/meld %arvo %d %meld ~))
  ++  exit
    |=  ~
    (emit %pass /poke/exit %agent [our.bowl %hood] %poke %drum-exit !>(~))
  ::
  ++  snub
    |=  [form=?(%allow %deny) ships=(list ship)]
    (emit %pass /poke/snub %arvo %a %snub form ships)
  ::
  ++  snob
    |=  [form=?(%allow %deny) ships=(list ship)]
    =/  old=[form=?(%allow %deny) ships=(list ship)]
      snub:scry
    =/  new=[form=?(%allow %deny) ships=(list ship)]
      ?:  ?=(%allow form.old)
        :-  %allow
        ?:  ?=(%allow form)
          (weld ships ships.old)
        ~(tap in (~(dif in (silt ships.old)) (silt ships)))
      :-  %deny
      ?:  ?=(%deny form)
        (weld ships ships.old)
      ~(tap in (~(dif in (silt ships.old)) (silt ships)))
    (emit %pass /poke/snub-mod %arvo %a %snub new)
  ::
  ++  moon
    |=  mun=(unit @p)
    ?>  ?=(?(%king %duke) (clan:title our.bowl))
    =/  mon=@p
      ?~  mun
        (add our.bowl (lsh 5 (end 5 (shaz eny.bowl))))
      ?>  =(%earl (clan:title u.mun))
      ?>  =(our.bowl (sein:title our.bowl now.bowl u.mun))
      u.mun
    ?>  =(~ (lyfe:scry mon))
    =/  [=pass key=@uw]  (moonkey mon 1 0)
    =/  =udiff:point:jael  [*id:block:jael %keys [1 1 pass] %.n]
    =.  moons  (~(put by moons) mon 1 0 key)
    =.  cor  (emit %pass /poke/moon %arvo %j %moon mon udiff)
    (emit %pass /jael/pubkey/(scot %p mon) %arvo %j %public-keys (silt mon ~))
  ::
  ++  moon-rekey
    |=  mon=@p
    =+  mun=(~(got by moons) mon)
    =/  =life  +(life.mun)
    =/  [=pass key=@uw]  (moonkey mon life rift.mun)
    =/  =udiff:point:jael  [*id:block:jael %keys [life 1 pass] %.n]
    =.  moons  (~(put by moons) mon mun(life life))
    (emit %pass /poke/moon-rekey %arvo %j %moon mon udiff)
  ::
  ++  moon-breach
    |=  mon=@p
    =+  mun=(~(got by moons) mon)
    =/  =rift  +(rift.mun)
    =/  =udiff:point:jael  [*id:block:jael %rift rift %.n]
    =.  moons  (~(put by moons) mon mun(rift rift))
    (emit %pass /poke/moon-breach %arvo %j %moon mon udiff)
  ::
  ++  dns-config
    |=  ~
    =/  addr=(each address:dns @t)  [%| 'https://zod.urbit.org/~/ip']
    =/  collector=dock  [~deg %dns-collector]
    =/  self-check=?  &
    =/  reset=?  &
    =/  =cage  helm-dns-config+!>([addr collector self-check reset])
    (emit %pass /poke/dns-config %agent [our.bowl %hood] %poke cage)
  ::
  ++  poke-block
    |=  marks=(set @tas)
    ?>  (~(all in marks) |=(=@tas (~(has in all.pokes) tas)))
    cor(black.pokes marks)
  --
++  scry
  |%
  ++  vere-info   .^(vere %$ (en-beam (beaker %$) /zen/ver))
  ++  desks       .^((set desk) %cd (en-beam (beaker %$) /))
  ++  blocked     .^(? %$ (en-beam (beaker %$) /zen/lag))
  ++  domains     .^((set turf) %e (en-beam (beaker %domains) /))
  ++  quiet       .^(? %$ (en-beam (beaker %$) /fad/lac))
  ++  http-ports  .^((pair @ud (unit @ud)) %e (en-beam (beaker %ports) /))
  ++  ames-proto  .^(@ud %ax (en-beam (beaker %$) /protocol/version))
  ++  latest      |=(=desk .^(cass:clay %cw (en-beam (beaker desk) /)))
  ++  desk-hash   |=(=desk .^(@uvI %cz (en-beam (beaker desk) /)))
  ++  agent-desk  |=(agent=@tas .^(desk %gd (en-beam (beaker agent) /$)))
  ++  life        |=(=ship (need (lyfe ship)))
  ++  rift        |=(=ship (need (ryft ship)))
  ++  sources  .^((map desk dock) %gx (en-beam (beaker %hood) /kiln/sources))
  ++  blocks  .^(@ud %gx (en-beam (beaker %eth-watcher) /block/azimuth/noun))
  ++  ryft
    |=  =ship
    .^((unit ^rift) %j (en-beam (beaker %ryft) /(scot %p ship)))
  ++  lyfe
    |=  =ship
    .^((unit ^life) %j (en-beam (beaker %lyfe) /(scot %p ship)))
  ++  snub
    .^  [form=?(%allow %deny) ships=(list ship)]
      %ax  (en-beam (beaker %$) /snubbed)
    ==
  ++  point
    |=  =ship
    .^  (unit point:naive)
      %gx  (en-beam (beaker %azimuth) /point/(scot %p ship)/noun)
    ==
   --
 ++  peek
  |%
  ++  allowed     ``boss-allowed+!>(pokes)
  ++  domains     ``boss-domains+!>(domains:scry)
  ++  http-ports  ``boss-http-ports+!>(http-ports:scry)
  ++  blocks      ``boss-blocks+!>(blocks:scry)
  ::
  ++  moons
    :^  ~  ~  %boss-moons
    !>  ^-  (map @p [=^life =rift])
    (~(run by ^moons) |=((trel @ @ @) [p q]))
  ::
  ++  moonkey
    |=  mon=@p
    :^  ~  ~  %boss-moonkey
    !>  ^-  [=ship key=@uw]
    [mon (tail (tail (~(got by ^moons) mon)))]
  ::
  ++  agent-desk
    |=  agent=@tas
    :^  ~  ~  %boss-agent-desk
    !>  ^-  [agent=@tas =desk]
    [agent (agent-desk:scry agent)]
  ::
  ++  our-info
    :^  ~  ~  %boss-our-info
    !>  ^-  ^our-info
    :*  our.bowl
        (sein:title our.bowl now.bowl our.bowl)
        (saxo:title our.bowl now.bowl our.bowl)
        (life:scry our.bowl)
        (rift:scry our.bowl)
        (clan:title our.bowl)
        (point:scry our.bowl)
    ==
  ::
  ++  sys-info
    :^  ~  ~  %boss-sys-info
    !>  ^-  ^sys-info
    =/  =cass:clay  (latest:scry %base)
    =/  =vere  vere-info:scry
    ?>  ?=([@ @ @ ~] rev.vere)
    :*  i.t.rev.vere
        i.t.t.rev.vere
        zuse
        (~(get by sources:scry) %base)
        (desk-hash:scry %base)
        da.cass
    ==
  --
++  arvo
  |%
  ++  pubkey
    |=  [=ship p=public-keys-result:jael]
    ?~  mun=(~(get by moons) ship)
      cor
    ?-    -.p
        %breach  cor
        %full
      ?~  got=(~(get by points.p) ship)
        cor
      cor(moons (~(put by moons) ship u.mun(life life.u.got, rift rift.u.got)))
    ::
        %diff
      ?.  =(ship who.p)
        cor
      ?-    -.diff.p
          %spon  cor
          %rift  cor(moons (~(put by moons) ship u.mun(rift to.diff.p)))
          %keys  cor(moons (~(put by moons) ship u.mun(life life.to.diff.p)))
      ==
    ==
  --
--

