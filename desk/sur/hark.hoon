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
++  antique
  |%
  ::  $rope: notification origin
  ::
  ::    Shows where a notification has come from. Used to group
  ::    notifications into threads
  +$  rope
    $:  gop=(unit flag)                 :: originating group
        can=(unit nest)               :: originating channel
        des=desk                        :: originating desk
        ted=path                        :: threading identifer
    ==
  ::  $thread: notification group
  ::
  +$  thread  (set id)
  ::  $yarn: notification
  +$  yarn
    $:  =id
        rop=rope                       :: origin
        tim=time                       :: time sent
        con=(list content)             :: content of notification
        wer=path                       :: where to link to in FE
        but=(unit button)              :: action, if any
    ==
  ::
  ::  $new-yarn: type for creating yarns
  +$  new-yarn
    $:  all=?
        desk=?
        rop=rope
        con=(list content)
        wer=path
        but=(unit button)
    ==
  ::
  +$  button
    $:  title=cord
        handler=path
    ==
  +$  flag  (pair ship term)
  ::  $content: notification text to be rendered
  +$  content
    $@  @t
    $%  [%ship p=ship]
        [%emph p=cord]
    ==
  ::  $action: Actions for hark
  ::
  ::    %add-yarn adds a notification to the relevant inboxes, indicated
  ::    by the loobs in the type
  ::    %saw-seam marks all notifications in an inbox as unread
  ::    %saw-rope marks a particular rope as read in all inboxes
  ::
  +$  action
    $%  [%add-yarn all=? desk=? =yarn]
        [%saw-seam =seam]
        [%saw-rope =rope]
    ==
  ::
  ::  $action-1: Actions for hark pt 2
  +$  action-1
    $%  [%new-yarn new-yarn]
        action
    ==
  ::
  +$  update
    $:  yarns=(map id yarn)
        =seam
        threads=(map time thread)
    ==
  ::
  +$  carpet
    $:  =seam
        yarns=(map id yarn)
        cable=(map rope thread)
        stitch=@ud
    ==
  +$  blanket
    $:  =seam
        yarns=(map id yarn)
        =quilt
    ==
  ::  $seam: inbox identifier
  ::
  ::    All notifications end up in one of these inboxes
  +$  seam
    $%  [%group =flag]
        [%desk =desk]
        [%all ~]
    ==
  ::  $rug: notifications inbox
  ::    .new contains all "unread" notifications, grouped by $rope
  ::    .qul is an archive
  ::
  +$  rug
    [new=(map rope thread) qul=quilt]
  ++  quilt
    =<  quilt
    |%
    ::  $quilt: inbox archive
    ::    Threads are keyed by an autoincrementing counter that starts at
    ::    0
    ::
    +$  quilt  ((mop @ud thread) lte)
    ++  on  ((^on @ud thread) lte)
    --
  ::
  ++  skein
    $:  =time
        count=@ud
        ship-count=@ud
        top=yarn
        unread=?
    ==
  --
--
