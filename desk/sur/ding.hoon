|%
::  $id: notification identifier
::    Supplied by origin. Must be unique. Suggest using eny.
::
+$  id  @uvH
::  $flag: Tlon Group ID
::
+$  flag  (pair ship term)
::  $nest: Tlon Channel ID
::
+$  nest  (pair term flag)
::  $origin: notification origin\
::    Shows where a notification has come from. Used to group
::    notifications into bundles
::
+$  origin
  $:  des=desk          :: originating desk
      pax=path          :: bundling identifier
      gop=(unit flag)   :: originating group
      can=(unit nest)   :: originating channel
  ==
::  $destination: where to link to in FE
::
+$  destination  quri:eyre
::  $notification: individual notification
::
+$  notification
  $:  =time
      =id
      =origin
      =contents
      =destination
  ==

::  $content: notification body text element
::
+$  content
  $@  @t
  $%  [%ship p=ship]
      [%emph p=cord]
  ==
::  $contents: notification body text full
::
+$  contents  (list content)
::  $bundle: group of notifications from same origin
::    Ordered by timestamp, latest first
::
+$  bundle  ((mop time notification) gte)
::
+$  bundles  (map origin bundle)
::
+$  action
  $%  [%create =id =origin =contents =destination]
      [%read =id]
      [%read-origin =origin]
      [%read-all ~]
  ==
::
+$  update
  $%  [%new =notification]
      [%read =id]
  ==
--
