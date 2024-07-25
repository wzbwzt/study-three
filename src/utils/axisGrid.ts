// 打开/关闭轴和网格的可见性
// lil-gui 要求一个返回类型为bool型的属性
// 来创建一个复选框，所以我们为 `visible`属性
// 绑定了一个setter 和 getter。 从而让lil-gui
// 去操作该属性.
import * as THREE from "three";

export default class AxisGridHelper {
  private _visible: boolean = false;

  public grid: THREE.GridHelper;
  public axes: THREE.AxesHelper;

  constructor(node: THREE.Object3D, units = 10) {
    const axes = new THREE.AxesHelper();
    (axes.material as THREE.Material).depthTest = false;
    axes.renderOrder = 2; // 在网格渲染之后再渲染
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible(): boolean {
    return this._visible;
  }
  set visible(v: boolean) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}
