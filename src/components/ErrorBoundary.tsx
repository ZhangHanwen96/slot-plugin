import React from "react";

interface IState {
    error: null | Error;
    render: number;
}

interface IProps {
    updater?: unknown;
    children: React.ReactNode;
    name?: string;
    shouldRetry?: boolean;
}

export const errorBoundaryRegistery: Map<string, undefined | {shouldRetry: boolean} > =
    new Map();

const errorRetryMap = new Map<string, number>();

export default class ErrorBoundary extends React.PureComponent<IProps, IState> {
    state: IState = {
        error: null,
        render: 0,
    };

    static getDerivedStateFromError(error: Error) {
        return { error, render: 1 };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log('error caught by error boundary')
        // const {shouldRetry = true, name} = this.props
        // if(!shouldRetry) {
        //     return
        // }
        // if(!name) {
        //     console.error('should provide a name for error boundary', error, errorInfo)
        //     return;
        // }
        // if(errorBoundaryRegistery.get(name)?.shouldRetry === false) {
        //     console.error('exceed maximum retry times', error, errorInfo)
        //     return;
        // }
        // let retry = errorRetryMap.get(name) || 2;
        // errorRetryMap.set(name, --retry);
        // if(retry >= 0) {
        //     // if something goes wrong, keep trying util hits the retry limit
        //     // 如果plugin一直出错的话就放弃渲染
        //     setTimeout(() => {
        //         this.setState({ error: null, render: 0 })
        //     }, 2000)
        // } else {
        //     errorBoundaryRegistery.set(name, { shouldRetry: false })
        // }
    }

    static getDerivedStateFromProps(preProps: IProps, prevState: IState) {
        if (prevState.render === 1) {
            return Object.assign({}, prevState, { render: 2 });
        }
        return {
            error: null,
            render: 0,
        };
    }

    render() {
        if (this.state.error) {
            return <div>error</div>;
        }
        return this.props.children;
    }
}
