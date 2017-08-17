declare module 'redux-subscriber' {
    export default function(store: any): () => void;
    
    export function subscribe(
        key: string, 
        cb: (state: any) => void
    ): () => void;
}
