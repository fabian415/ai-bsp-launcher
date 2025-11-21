export namespace main {
	
	export class CPUMetrics {
	    usagePercent: number;
	
	    static createFrom(source: any = {}) {
	        return new CPUMetrics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.usagePercent = source["usagePercent"];
	    }
	}
	export class DiskMetrics {
	    usedGB: number;
	    totalGB: number;
	    usedPercent: number;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new DiskMetrics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.usedGB = source["usedGB"];
	        this.totalGB = source["totalGB"];
	        this.usedPercent = source["usedPercent"];
	        this.path = source["path"];
	    }
	}
	export class MemoryMetrics {
	    usedGB: number;
	    totalGB: number;
	    usedPercent: number;
	
	    static createFrom(source: any = {}) {
	        return new MemoryMetrics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.usedGB = source["usedGB"];
	        this.totalGB = source["totalGB"];
	        this.usedPercent = source["usedPercent"];
	    }
	}
	export class SystemMetrics {
	    cpu: CPUMetrics;
	    memory: MemoryMetrics;
	    disk: DiskMetrics;
	
	    static createFrom(source: any = {}) {
	        return new SystemMetrics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cpu = this.convertValues(source["cpu"], CPUMetrics);
	        this.memory = this.convertValues(source["memory"], MemoryMetrics);
	        this.disk = this.convertValues(source["disk"], DiskMetrics);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

