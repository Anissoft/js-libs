import React from 'react';
import { act as ReactAct, fireEvent, render } from '@testing-library/react';
import { act, renderHook, cleanup } from '@testing-library/react-hooks';

import { useSharedState, SharedStateProvider } from './useSharedState';

const source = { key: 'value' };
const patch1 = { key: 'value1' };
const patch2 = { key: 'value2' };

const Example = () => {
  const [state, setState] = useSharedState('state', source);

  return React.createElement('span', {}, `value = ${state.key}`);
};

describe('useSharedState', () => {
  afterEach(() => {
    cleanup();
  })

  it('Should return state, and function to update it', () => {
    const { result } = renderHook(() => useSharedState('source', source));

    expect(result.current[0]).toEqual(source);

    act(() => {
      result.current[1](patch1);
    });

    expect(result.current[0]).toEqual({ ...source, ...patch1 });
    expect(result.current[0]).not.toEqual(source);

    act(() => {
      result.current[1](state => ({ ...state, ...patch2 }));
    });

    expect(result.current[0]).toEqual({ ...source, ...patch1, ...patch2 });
  });

  it('should share state between calls with same id', () => {
    const { result: result1 } = renderHook(() => useSharedState('source', source));
    const { result: result2 } = renderHook(() => useSharedState('source', source));

    expect(result1.current[0]).toEqual(result2.current[0]);

    act(() => {
      result1.current[1](patch1);
    });

    expect(result1.current[0]).toEqual({ ...patch1 });
    expect(result1.current[0]).toEqual(result2.current[0]);
  });

  it('shouldn\'t share state between calls with different id', () => {
    const { result: result1 } = renderHook(() => useSharedState('source1', source));
    const { result: result2 } = renderHook(() => useSharedState('source2', source));

    expect(result1.current[0]).toEqual(result2.current[0]);

    act(() => {
      result1.current[1](patch1);
    });

    expect(result1.current[0]).toEqual({ ...patch1 });
    expect(result1.current[0]).not.toEqual(result2.current[0]);
    expect(result2.current[0]).toEqual(source);
  });

  it('SharedStateProvider should isolate states', () => {
    const { result } = renderHook(() => useSharedState('source', patch1));

    const { container } = render(
      React.createElement(SharedStateProvider, {},
        React.createElement(React.Fragment, {}, [
          React.createElement(Example, { key: '1' }),
          "; ",
          React.createElement(Example, { key: '2' }),
          React.createElement(() => {
            const [state, setState] = useSharedState('state', source);
            return React.createElement('button', { id: 'button', onClick: () => { setState({ key: `${state.key}+1` }) } })
          }, { key: '3' }),
        ])
      )
    );

    expect(result.current[0]).toEqual(patch1);
    expect(container.textContent).toBe(`value = ${source.key}; value = ${source.key}`);

    act(() => {
      result.current[1](patch2);
    });

    expect(result.current[0]).toEqual(patch2);
    expect(container.textContent).toBe(`value = ${source.key}; value = ${source.key}`);

    ReactAct(() => {
      fireEvent(
        container.querySelector('#button')!,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      )
    });

    expect(container.textContent).toBe(`value = ${source.key}+1; value = ${source.key}+1`);
  })
})