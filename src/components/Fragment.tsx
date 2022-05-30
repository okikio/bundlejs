import { ComponentProps, JSX, ParentProps } from "solid-js";

export function Fragment(props: ParentProps<ComponentProps<keyof JSX.IntrinsicElements>> & {
    as?: keyof JSX.IntrinsicElements;
}) { 
    let {
        as,
        ...attrs
    } = props;

    if (typeof as == "string" && as.length > 0) {
        let Tag: keyof JSX.IntrinsicElements = `${as}`;
        // @ts-ignore
        return <Tag {...attrs} />; 
    } 
    
    return <>{attrs.children}</>;

} 

export default Fragment;