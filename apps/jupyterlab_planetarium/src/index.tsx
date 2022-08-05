import * as React from 'react';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { ReactWidget } from '@jupyterlab/apputils';

import { JSONObject } from '@lumino/coreutils';

import { Widget } from '@lumino/widgets';
import Planetarium from '@openastrodynamics/r3f';

/**
 * The default mime type for the extension.
 */
const MIME_TYPE = 'application/vnd.json+orbit';

/**
 * The class name added to the extension.
 */
const CLASS_NAME = 'mimerenderer-json_orbit';

/**
 * A widget for rendering json_orbit.
 */
export class OutputWidget extends ReactWidget {
  /**
   * Construct a new output widget.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this.addClass(CLASS_NAME);
  }

  /**
   * Render json_orbit into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const data = model.data[this._mimeType] as JSONObject;
    console.log(this);
    console.log('norbert');
    this.node.textContent = JSON.stringify(data);

    return Promise.resolve();
  }

  render() {
    return <Planetarium />;
  }

  private _mimeType: string;
}

/**
 * A mime renderer factory for json_orbit data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: (options) => new OutputWidget(options),
};

/**
 * Extension definition.
 */
const extension: IRenderMime.IExtension = {
  id: 'jupyterlab_planetarium:plugin',
  rendererFactory,
  rank: 100,
  dataType: 'json',
  fileTypes: [
    {
      name: 'json_orbit',
      mimeTypes: [MIME_TYPE],
      extensions: ['.json'],
    },
  ],
  documentWidgetFactoryOptions: {
    name: 'Planetarium',
    primaryFileType: 'json_orbit',
    fileTypes: ['json_orbit'],
    defaultFor: ['json_orbit'],
  },
};

export default extension;
