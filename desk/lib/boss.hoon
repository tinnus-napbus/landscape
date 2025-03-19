/-  boss
/+  naive
|%
++  enjs
  =,  enjs:format
  |%
  ::  pokes
  ::
  ++  pack  ~
  ++  meld  ~
  ++  exit  ~
  ++  snob  snub
  ++  moon-breach  moon-rekey
  ++  snub
    |=  [form=?(%allow %deny) ships=(list ship)]
    ^-  json
    %-  pairs
    :~  form+s+form
        ships+a+(turn ships |=(=@p s+(scot %p p)))
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
  ++  moons
    |=  mons=(map @p [=life =rift])
    ^-  json
    :-  %a
    %+  turn  ~(tap by mons)
    |=  [mon=@p =life =rift]
    (pairs moon+s+(scot %p mon) life+(numb life) rift+(numb rift) ~)
  ::
  ++  moonkey
    |=  [=ship key=@uw]
    (pairs moon+s+(scot %p ship) key+s+(scot %uw key) ~)
  ::
  ++  agent-desk
    |=  [agent=@tas =desk]
    (pairs agent+s+agent desk+s+desk ~)
  ::
  ++  our-info
    |=  inf=our-info:boss
    |^
    %-  pairs
    :~  our+s+(scot %p our.inf)
        sponsor+s+(scot %p sponsor.inf)
        chain+a+(turn chain.inf |=(=ship s+(scot %p ship)))
        life+(numb life.inf)
        rift+(numb rift.inf)
        rank+s+rank.inf
        point+(point ?~(point.inf ~ (point point.inf)))
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
              escape+?~(escape.net.p ~ (scot %p u.escape.net.p))
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
  ++  moon-rekey  (se %p)
  ++  moon-breach  (se %p)
  ++  snub
    ^-  [form=?(%allow %deny) ships=(list ship)]
    %-  ot
    :~  form+(su (perk %allow %deny ~))
        ships+(ar (se %p))
    ==
  ::  scries
  ::
  ++  moonkey  (ot moon+(se %p) key+(se %uw) ~)
  ++  agent-desk  (ot agent+so desk+so ~)
  ++  moons
    %+  ci
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
  --
--
