export default class BasicArrowHelper {
    constructor() {
        this.up = null;
        this.forward = null;
        this.right = null;
        this.obj = null;

        this.init();
    }

    init() {
        // Example arrow helper
        this.forward = new window.THREE.Vector3(1, 0, 0);
        this.up = new window.THREE.Vector3(0, 1, 0);
        this.right = new window.THREE.Vector3(0, 0, 1);

        //normalize the direction vector (convert to vector of length 1)
        this.forward.normalize();
        this.up.normalize();
        this.right.normalize();

        var origin = new window.THREE.Vector3(0, 0, 0);
        var length = 20;
        var red = 0xff0000;
        var green = 0x00ff00;
        var blue = 0x0000ff;

        var object = new window.THREE.Object3D();
        var arrowHelper = new window.THREE.ArrowHelper(this.forward, origin, length, red);
        var arrowHelper2 = new window.THREE.ArrowHelper(this.up, origin, length, blue);
        var arrowHelper3 = new window.THREE.ArrowHelper(this.right, origin, length, green);
        object.add(arrowHelper);
        object.add(arrowHelper2);
        object.add(arrowHelper3);

        this.obj = object;
    }

    getObject() {
        return this.obj;
    }
}