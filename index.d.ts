declare module 'redux-subscriber' {
    export default function(store: any): () => void;
    
    export function subscribe(
        selector: string | Function, 
        cb: (state: any) => void
    ): () => void;
}
