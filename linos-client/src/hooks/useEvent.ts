import { useCallback, useEffect, useState } from "react";
import useCurrentAccount from "./useCurrentAccount";

export type EVENT_TYPE = {
    [key: string]: Array<any>
}




export function useEventSubscriber({ onEvent, contract, eventName }: { onEvent: (event: any, eventName: string) => void, contract: any; eventName: string;}) {

    return useEffect(() => {
      const _onEvent = (event: any) => {
          onEvent(event, eventName);
      }

      const eventEmitter = contract.events[eventName]({ fromBlock: 'earliest' });
      eventEmitter.addListener('data', _onEvent);

      return () => {
          eventEmitter.removeListener('data', _onEvent);
      }

    // eslint-disable-next-line
    }, [contract, eventName]);
}

export function useEvents({ contract, eventName }: { contract: any; eventName: string; }): [events: Array<any>, refresh: () => Promise<any>] {

  const [events, setEvents] = useState<Array<any>>([]);

  const loadPastEvents = useCallback(async () => {
    if (!contract) {
      return;
    }
    const resultEvents = await contract.getPastEvents(eventName, { fromBlock: 0, toBlock: 'latest' });

    console.log("resultEvents", [...resultEvents]);
    setEvents(resultEvents.reverse());
  }, [eventName, contract])

  useEffect(() => {
    if (contract) {
      loadPastEvents();
    }

    return () => {
      setEvents([]);
    }
  }, [eventName, contract]);

  return [events, loadPastEvents];
}