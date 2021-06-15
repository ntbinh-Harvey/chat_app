import * as React from "react";

const AsyncStatus = {
  IDLE: "idle",
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

function useSafeDispatch(dispatch) {
  const mounted = React.useRef(false);

  React.useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return React.useCallback(
    (...args) => {
      mounted.current && dispatch(...args);
    },
    [dispatch]
  );
}

const defaultInitialState = {
  status: AsyncStatus.IDLE,
  data: null,
  error: null,
};

function useAsync(initialState) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  });
  const [{ status, data, error }, setState] = React.useReducer(
    (s, a) => ({ ...s, ...a }),
    initialStateRef.current
  );

  const safeSetState = useSafeDispatch(setState);

  const run = React.useCallback(
    (promise) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`
        );
      }
      safeSetState({ status: AsyncStatus.PENDING });
      return promise.then(
        (data) => {
          safeSetState({ data, status: AsyncStatus.RESOLVED });
          return {
            ...data,
            success: true,
          };
        },
        (error) => {
          safeSetState({ status: AsyncStatus.REJECTED, error });
          return {
            ...error,
            success: false,
          };
        }
      );
    },
    [safeSetState]
  );

  const setData = React.useCallback(
    (data) => safeSetState({ data }),
    [safeSetState]
  );
  const setError = React.useCallback(
    (error) => safeSetState({ error }),
    [safeSetState]
  );
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  );

  return {
    isIdle: status === AsyncStatus.IDLE,
    isLoading: status === AsyncStatus.PENDING,
    isError: status === AsyncStatus.REJECTED,
    isSuccess: status === AsyncStatus.RESOLVED,
    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}

export default useAsync;
