/-  *contacts
|%
::  +cy: contact map engine
::
++  cy
  |_  c=contact
  ::  +get: get typed value
  ::
  ++  get
    |*  [key=@tas typ=value-type]
    ^-  (unit _p:*$>(_typ value))
    =/  val=(unit value)  (~(get by c) key)
    ?~  val  ~
    ?~  u.val  !!
    ~|  "{<typ>} expected at {<key>}"
    ?-  typ
      %text  ?>(?=(%text -.u.val) (some p.u.val))
      %date  ?>(?=(%date -.u.val) (some p.u.val))
      %tint  ?>(?=(%tint -.u.val) (some p.u.val))
      %ship  ?>(?=(%ship -.u.val) (some p.u.val))
      %look  ?>(?=(%look -.u.val) (some p.u.val))
      %cult  ?>(?=(%cult -.u.val) (some p.u.val))
      %set   ?>(?=(%set -.u.val) (some p.u.val))
    ==
  ::  +ges: get specialized to set
  ::
  ++  ges
    |*  [key=@tas typ=value-type]
    ^-  (unit (set $>(_typ value)))
    =/  val=(unit value)  (~(get by c) key)
    ?~  val  ~
    ~|  "set expected at {<key>}"
    ?>  ?=(%set -.u.val)
    %-  some
    %-  ~(run in p.u.val)
      ?-  typ
        %text  |=(v=value ?>(?=(%text -.v) v))
        %date  |=(v=value ?>(?=(%date -.v) v))
        %tint  |=(v=value ?>(?=(%tint -.v) v))
        %ship  |=(v=value ?>(?=(%ship -.v) v))
        %look  |=(v=value ?>(?=(%look -.v) v))
        %cult  |=(v=value ?>(?=(%cult -.v) v))
        %set   |=(v=value ?>(?=(%set -.v) v))
      ==
  ::  +gos: got specialized to set
  ::
  ++  gos
    |*  [key=@tas typ=value-type]
    ^-  (set $>(_typ value))
    =/  val=value  (~(got by c) key)
    ~|  "set expected at {<key>}"
    ?>  ?=(%set -.val)
    %-  ~(run in p.val)
      ?-  typ
        %text  |=(v=value ?>(?=(%text -.v) v))
        %date  |=(v=value ?>(?=(%date -.v) v))
        %tint  |=(v=value ?>(?=(%tint -.v) v))
        %ship  |=(v=value ?>(?=(%ship -.v) v))
        %look  |=(v=value ?>(?=(%look -.v) v))
        %cult  |=(v=value ?>(?=(%cult -.v) v))
        %set   |=(v=value ?>(?=(%set -.v) v))
      ==
  ::  +gut: got with default
  ::
  ++  gut
    |*  [key=@tas def=value]
    ^+  +.def
    =/  val=value  (~(gut by c) key ~)
    ?~  val
      +.def
    ~|  "{<-.def>} expected at {<key>}"
    ?-  -.val
      %text  ?>(?=(%text -.def) p.val)
      %date  ?>(?=(%date -.def) p.val)
      %tint  ?>(?=(%tint -.def) p.val)
      %ship  ?>(?=(%ship -.def) p.val)
      %look  ?>(?=(%look -.def) p.val)
      %cult  ?>(?=(%cult -.def) p.val)
      %set   ?>(?=(%set -.def) p.val)
    ==
  ::  +gub: got with bunt default
  ::
  ++  gub
    |*  [key=@tas typ=value-type]
    ^+  +:*$>(_typ value)
    =/  val=value  (~(gut by c) key ~)
    ?~  val
      ?+  typ  !!
        %text  *@t
        %date  *@da
        %tint  *@ux
        %ship  *@p
        %look  *@t
        %cult  *flag:g
        %set   *(set value)
      ==
    ?-  typ
      %text  ?>(?=(%text -.val) p.val)
      %date  ?>(?=(%date -.val) p.val)
      %tint  ?>(?=(%tint -.val) p.val)
      %ship  ?>(?=(%ship -.val) p.val)
      %look  ?>(?=(%look -.val) p.val)
      %cult  ?>(?=(%cult -.val) p.val)
      %set   ?>(?=(%set -.val) p.val)
    ==
  --
::
++  do-edit-0
  |=  [c=contact-0:legacy:legacy f=field-0:legacy]
  ^+  c
  ?-  -.f
    %nickname   c(nickname nickname.f)
    %bio        c(bio bio.f)
    %status     c(status status.f)
    %color      c(color color.f)
  ::
    %avatar     ~|  "cannot add a data url to avatar!"
                ?>  ?|  ?=(~ avatar.f)
                        !=('data:' (end 3^5 u.avatar.f))
                    ==
                c(avatar avatar.f)
  ::
    %cover      ~|  "cannot add a data url to cover!"
                ?>  ?|  ?=(~ cover.f)
                        !=('data:' (end 3^5 u.cover.f))
                    ==
                c(cover cover.f)
  ::
    %add-group  c(groups (~(put in groups.c) flag.f))
  ::
    %del-group  c(groups (~(del in groups.c) flag.f))
  ==
::
++  sane-contact
  |=  con=contact
  ^-  ?
  ::  1kB contact should be enough for everyone
  ::
  ?:  (gth (met 3 (jam con)) 1.000)
    |
  ::  prohibit data URLs in the image links
  ::
  =+  avatar=(~(get cy con) %avatar %text)
  ::  XX restrict also on 
  ?:  ?&  ?=(^ avatar)
          =('data:' (end 3^5 u.avatar))
      ==
    |
  =+  cover=(~(get cy con) %cover %text)
  ?:  ?&  ?=(^ cover)
          !=('data:' (end 3^5 u.cover))
      ==
    |
  &
::
++  do-edit
  |=  [con=contact edit=(map @tas value)]
  ^+  con
  =/  don  (~(uni by con) edit)
  =/  del=(list @tas)
    ::  XX accumulate new map?
    ::
    %-  ~(rep by don)
    |=  [[key=@tas val=value] acc=(list @tas)]
    ?.  ?=(~ val)  acc
    [key acc]
  =?  don  !=(~ del)
    %+  roll  del
    |=  [key=@tas acc=_don]
    (~(del by don) key)
  ?>  (sane-contact don)
  don
::  +to-contact: convert contact-0:legacy:legacy
::
++  to-contact
  |=  c=contact-0:legacy
  ^-  contact
  =/  o=contact
    %-  malt
    ^-  (list (pair @tas value))
    :~  nickname+text/nickname.c
        bio+text/bio.c
        status+text/status.c
        color+tint/color.c
    ==
  =?  o  ?=(^ avatar.c)
    (~(put by o) %avatar text/u.avatar.c)
  =?  o  ?=(^ cover.c)
    (~(put by o) %cover text/u.cover.c)
  =?  o  !?=(~ groups.c)
    %+  ~(put by o)  %groups
    :-  %set
    %-  ~(run in groups.c)
    |=  =flag:g
    cult/flag
  o
::  +to-contact-0: convert contact
::
++  to-contact-0
  |=  c=contact
  ^-  $@(~ contact-0:legacy)
  ?~  c  ~
  =|  o=contact-0:legacy
  %=  o
    nickname
      (~(gub cy c) %nickname %text)
    bio
      (~(gub cy c) %bio %text)
    status
      (~(gub cy c) %status %text)
    color
      (~(gub cy c) %color %tint)
    avatar
      :: XX prohibit data: link
      (~(get cy c) %avatar %text)
    cover
      :: XX prohibit data: link
      (~(get cy c) %cover %text)
    groups
      =/  groups
        (~(get cy c) %groups %set)
      ?~  groups  ~
      ^-  (set flag:g)
      %-  ~(run in u.groups)
      |=  val=value
      ?>  ?=(%cult -.val)
      p.val
  ==
::  +contact-mod: merge contacts
::
++  contact-mod
  |=  [c=contact mod=contact]
  ^-  contact
  (~(uni by c) mod)
::  +to-profile: convert profile-0:legacy
::
++  to-profile
  |=  o=profile-0:legacy
  ^-  profile
  [wen.o ?~(con.o ~ (to-contact con.o))]
::  +to-profile-0:legacy: convert profile
::
++  to-profile-0
  |=  p=profile
  ^-  profile-0:legacy
  [wen.p (to-contact-0 con.p)]
::
++  to-profile-0-mod
  |=  [p=profile mod=contact]
  ^-  profile-0:legacy
  [wen.p (to-contact-0 (contact-mod con.p mod))]
::
++  to-foreign-0
  |=  f=foreign
  ^-  foreign-0:legacy
  [?~(for.f ~ (to-profile-0 for.f)) sag.f]
::  +to-foreign-0-mod: convert foreign with contact overlay
::
++  to-foreign-0-mod
  |=  [f=foreign mod=contact]
  ^-  foreign-0:legacy
  [?~(for.f ~ (to-profile-0-mod for.f mod)) sag.f]
::  +foreign-mod: fuse peer contact with overlay
::
++  foreign-mod
  |=  [far=foreign mod=contact]
  ^-  foreign
  ?~  for.far
    far
  far(con.for (contact-mod con.for.far mod))
::  +foreign-contact: grab foreign contact
::
++  foreign-contact
  |=  far=foreign
  ^-  contact
  ?~(for.far ~ con.for.far)
::
+$  sole-field-0
  $~  nickname+''
  $<(?(%add-group %del-group) field-0:legacy)
::
++  to-sole-edit-1
  |=  edit-0=(list sole-field-0)
  ^-  contact
  %+  roll  edit-0
    |=  $:  fed=sole-field-0
            acc=(map @tas value)
        ==
    ::  XX under a single ~put ?
    ^+  acc
    ?-  -.fed
        ::
        %nickname
      %+  ~(put by acc)
        %nickname
      text/nickname.fed
        ::
        %bio
      %+  ~(put by acc)
        %bio
      text/bio.fed
        ::
        %status
      %+  ~(put by acc)
        %status
      text/status.fed
        ::
        %color
      %+  ~(put by acc)
        %color
      tint/color.fed
        ::
        %avatar
      ?~  avatar.fed  acc
      %+  ~(put by acc)
        %avatar
      look/u.avatar.fed
        ::
        %cover
      ?~  cover.fed  acc
      %+  ~(put by acc)
        %cover
      look/u.cover.fed
    ==
::
++  to-edit-1
  |=  [edit-0=(list field-0:legacy) groups=(set value)]
  ^-  contact
  ::  translating v0 profile edit to v1 %self is non-trivial:
  ::  for field edits other than groups, we derive a contact
  ::  edit map. for group operations (%add-group, %del-group)
  ::  we need to operate directly on (existing?) groups field in
  ::  the profile.
  ::
  :: .tid: field edit actions, no group edit
  :: .gid: only group edit actions
  ::
  =*  group-type  ?(%add-group %del-group)
  =*  sole-edits  (list $<(group-type field-0:legacy))
  =*  group-edits  (list $>(group-type field-0:legacy))
  ::  sift v0 edits
  ::  XX tall structure mode?
  ::
  =/  [sid=sole-edits gid=group-edits]
    ::
    ::  XX why is casting neccessary here?
    =-  [(flop `sole-edits`-<) (flop `group-edits`->)]
    %+  roll  edit-0
    |=  [f=field-0:legacy sid=sole-edits gid=group-edits]
    ^+  [sid gid]
    ?.  ?=(group-type -.f)
      :-  [f sid]
      gid
    :-  sid
    [f gid]
  ::  edit groups
  ::
  =.  groups
    %+  roll  gid
    |=  [ged=$>(group-type field-0:legacy) =_groups]
    ?-  -.ged
      %add-group
    (~(put in groups) cult/flag.ged)
      %del-group
    ~|  "group {<flag.ged>} not found"
    (~(del in groups) cult/flag.ged)
    ==
  %-  ~(uni by (to-sole-edit-1 sid))
  ^-  contact
  [%groups^set/groups ~ ~]
::
++  to-action
  |=  o=$<(%edit action-0:legacy)
  ^-  action
  ?-  -.o
    %anon  [%anon ~]
    ::
    :: old %meet is now a no-op
    %meet  [%meet ~]
    %heed  [%meet p.o]
    %drop  [%drop p.o]
    %snub  [%snub p.o]
  ==
::
++  mono
  |=  [old=@da new=@da]
  ^-  @da
  ?:  (lth old new)  new
  (add old ^~((rsh 3^2 ~s1)))
--
