import { Camera } from './Camera';
import { Vector2 } from './Vector2';
import { Matrix4 } from './Matrix4';
import { RenderTarget } from './WebGLRenderLists';

export class LightShadow {
  constructor(camera: Camera);

  camera: Camera;
  bias: number;
  radius: number;
  mapSize: Vector2;
  map: RenderTarget;
  matrix: Matrix4;

  copy(source: LightShadow): this;
  clone(recursive?: boolean): this;
  toJSON(): any;
}
