import m from 'mithril';

export const oyunkeyfSri = Math.random().toString(36).substring(2);

export function autoredraw(action) {
  m.startComputation();
  try {
    return action();
  } finally {
    m.endComputation();
  }
}

export function hasNetwork() {
  return window.navigator.connection.type !== window.Connection.NONE;
}

export function noop() {}

export function getBoardBounds(viewportDim, isPortrait, isIpadLike, mode) {
  const { vh, vw } = viewportDim;
  const top = 50;

  if (isPortrait) {
    // const contentHeight = vh - 50;
    // const pTop = 50 + (mode === 'game' ? ((contentHeight - vw - 40) / 2) : 0);
    const contentHeight = vh;
    const pTop = 0;
    return {
      top: pTop,
      right: vw,
      bottom: pTop + vw,
      left: 0,
      width: vw,
      height: vw
    };
  } else {
    // const lSide = vh - top;
    const lSide = vh;
    const lWidth = lSide * (4/3);
    const spaceCenter = vw - lWidth;
    return {
      top,
      right: lSide,
      bottom: top + lSide,
      left: spaceCenter / 2,
      width: lWidth,
      height: lSide
    };
  }
}
