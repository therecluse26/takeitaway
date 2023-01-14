import { Component, ReactNode } from "react";

export interface LazyLoadProps {
    className?: string;
    height?: number | string;
    width?: number | string;
    debounce?: boolean;
    elementType?: string;
    offset?: number;
    offsetBottom?: number;
    offsetHorizontal?: number;
    offsetLeft?: number;
    offsetRight?: number;
    offsetTop?: number;
    offsetVertical?: number;
    threshold?: number;
    children?: ReactNode;
    throttle?: number | boolean;
    onContentVisible?: Function;
}

export default class LazyLoad extends Component<LazyLoadProps> {
    constructor(props: LazyLoad);
}