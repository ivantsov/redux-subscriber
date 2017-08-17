// Type definitions for "redux-subscriber" 1.1.0 
// Project: redux-subscriber
// Definitions by: eliasparis <https://github.com/eliasparis>

declare module 'redux-subscriber' {
    
    export const subscribers: Object;

    export function subscribe(key : string, cb : (state: any) => void) : void;

    export default function( store: any) : () => void;
}