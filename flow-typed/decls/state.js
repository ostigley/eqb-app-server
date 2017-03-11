 declare type state = {
   bodies: bodies,
   level: level,
   progress: number,
   players: players
 }

 declare type bodies = {
   '1': body,
   '2': body,
   '3': body,
 }

 declare type body = {
   head: string,
   body: string,
   legs: string,
   clue: string,
   final: string
 }

 declare type level = {
   current: ?boolean,
   previous: ?boolean,
   hasChanged: boolean
 };

 declare type players = {
   num: number,
   [key: string]: player
 }


 declare type player = {
   id: string,
   body: string | number,
   dimensions: dimension
 }

declare type dimension = {
   height: number,
   width: number
}