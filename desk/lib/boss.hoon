/-  boss
/+  naive
|%
++  enjs
  =,  enjs:format
  |%
  ::  pokes
  ::
  ++  dns-config  ~
  ++  pack  ~
  ++  meld  ~
  ++  exit  ~
  ++  snob  snub
  ++  moon-breach  moon-rekey
  ++  snub
    |=  snu=snub-args:boss
    ^-  json
    %-  pairs
    :~  form+s+form.snu
        ships+a+(turn ships.snu |=(=@p s+(scot %p p)))
    ==
  ::
  ++  moon
    |=  mun=(unit @p)
    ^-  json
    ?~  mun
      ~
    s+(scot %p u.mun)
  ::
  ++  moon-rekey
    |=  mon=@p
    ^-  json
    s+(scot %p mon)
  ::  scries
  ::
  ++  our
    |=  =@p
    ^-  json
    s+(scot %p p)
  ::
  ++  blocks
    |=  count=@ud
    (numb count)
  ::
  ++  moons
    |=  mons=(map @p [=life =rift])
    ^-  json
    :-  %a
    %+  turn  ~(tap by mons)
    |=  [mon=@p =life =rift]
    (pairs moon+s+(scot %p mon) life+(numb life) rift+(numb rift) ~)
  ::
  ++  moonkey
    |=  [=@p key=@uw]
    (pairs moon+s+(scot %p p) key+s+(scot %uw key) ~)
  ::
  ++  agent-desk
    |=  [agent=@tas =desk]
    (pairs agent+s+agent desk+s+desk ~)
  ::
  ++  http-ports
    |=  [http=@ud https=(unit @ud)]
    (pairs http+(numb http) https+?~(https ~ (numb u.https)) ~)
  ::
  ++  our-info
    |=  inf=our-info:boss
    |^
    %-  pairs
    :~  our+s+(scot %p our.inf)
        sponsor+s+(scot %p sponsor.inf)
        chain+a+(turn chain.inf |=(=@p s+(scot %p p)))
        life+(numb life.inf)
        rift+(numb rift.inf)
        rank+s+rank.inf
        point+?~(point.inf ~ (point u.point.inf))
    ==
    ::
    ++  point
      |=  p=point:naive
      %-  pairs
      :~  dominion+s+dominion.p
          :-  %own
          %-  pairs
          :~  owner+(addr-non owner.own.p)
              spawn-proxy+(addr-non spawn-proxy.own.p)
              management-proxy+(addr-non management-proxy.own.p)
              voting-proxy+(addr-non voting-proxy.own.p)
              transfer-proxy+(addr-non transfer-proxy.own.p)
          ==
      ::
          :-  %net
          %-  pairs
          :~  rift+(numb rift.net.p)
              keys+(keys keys.net.p)
              sponsor+(sponsor sponsor.net.p)
              escape+?~(escape.net.p ~ s+(scot %p u.escape.net.p))
      ==  ==
    ::
    ++  addr-non
      |=  [=address:naive =nonce:naive]
      %-  pairs
      :~  address+s+(crip '0' 'x' ((x-co:co 40) address))
          nonce+(numb nonce)
      ==
    ::
    ++  keys
      |=  k=keys:naive
      %-  pairs
      :~  life+(numb life.k)
          suite+(numb suite.k)
          auth+s+(scot %uw auth.k)
          crypt+s+(scot %uw crypt.k)
      ==
    ::
    ++  sponsor
      |=  [has=? who=@p]
      (pairs has+b+has who+s+(scot %p who) ~)
    --
  ::
  ++  sys-info
    |=  sys=sys-info:boss
    |^  ^-  json
    %-  pairs
    :~  pace+s+pace.sys
        vere-version+s+vere-version.sys
        zuse+(numb zuse.sys)
        ota-source+?~(ota-source.sys ~ (dock u.ota-source.sys))
        base-hash+s+(scot %uv base-hash.sys)
        base-time+s+(scot %da base-time.sys)
    ==
    ::
    ++  dock
      |=  doc=^dock
      ^-  json
      %-  pairs
      :~  ship+s+(scot %p p.doc)
          desk+s+q.doc
      ==
    --
  ::
  ++  domains
    |=  turfs=(set turf)
    ^-  json
    :-  %a
    %+  turn  ~(tap in turfs)
    |=  =turf
    s+(en-turf:de-purl:html turf)
  ::
  ++  allowed
    |=  [all=(set @tas) black=(set @tas)]
    ^-  json
    %-  pairs
    :~  all+a+(turn ~(tap in all) (lead %s))
        black+a+(turn ~(tap in black) (lead %s))
    ==
  --
++  dejs
  =,  dejs:format
  |%
  ::  pokes
  ::
  ++  pack  ul
  ++  meld  ul
  ++  exit  ul
  ++  snob  snub
  ++  moon  (mu (se %p))
  ++  dns-config  ul
  ++  moon-rekey  (se %p)
  ++  moon-breach  (se %p)
  ++  snub
    %-  ot
    :~  form+(su (perk %allow %deny ~))
        ships+(ar (se %p))
    ==
  ::  scries
  ::
  ++  our  (se %p)
  ++  blocks  ni
  ++  moonkey  (ot moon+(se %p) key+(se %uw) ~)
  ++  agent-desk  (ot agent+so desk+so ~)
  ++  http-ports  (ot http+ni https+(mu ni) ~)
  ::
  ++  moons
    %+  cu
      |=  l=(list (trel @p @ud @ud))
      (~(gas by *(map @p [=life =rift])) l)
    (ar (ot moon+(se %p) life+ni rift+ni ~))
  ::
  ++  our-info
    |^
    %-  ot
    :~  dominion+so
        :-  %own
        %-  ot
        :~  owner+addr-non
            spawn-proxy+addr-non
            management-proxy+addr-non
            voting-proxy+addr-non
            transfer-proxy+addr-non
        ==
    ::
        :-  %net
        %-  ot
        :~  rift+ni
            keys+ni
            sponsor+(ot has+bo who+(se %p) ~)
            escape+(mu (se %p))
        ==
    ==
    ::
    ++  addr-non
      %-  ot
      :~  address+(su ;~(pfix (jest '0x') hex))
          nonce+ni
      ==
    --
  ::
  ++  sys-info
    %-  ot
    :~  pace+so
        vere-version+so
        zuse+ni
        ota-source+(mu (ot ship+(se %p) desk+so ~))
        base-hash+(se %uv)
        base-time+(se %da)
    ==
  ::
  ++  domains
    %-  as
    %-  su
    %+  sear
      |=  =host:eyre
      ^-  (unit turf)
      ?.(?=(%& -.host) ~ (some p.host))
    thos:de-purl:html
  ::
  ++  allowed
    %-  ot
    :~  all+(as so)
        black+(as so)
    ==
  --
--
