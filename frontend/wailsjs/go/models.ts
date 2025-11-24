export namespace main {
	
	export class ActivityItem {
	    id: string;
	    // Go type: time
	    timestamp: any;
	    platformID: string;
	    platformName: string;
	    operation: string;
	    status: string;
	    duration: number;
	    bootOption: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new ActivityItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.timestamp = this.convertValues(source["timestamp"], null);
	        this.platformID = source["platformID"];
	        this.platformName = source["platformName"];
	        this.operation = source["operation"];
	        this.status = source["status"];
	        this.duration = source["duration"];
	        this.bootOption = source["bootOption"];
	        this.error = source["error"];
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
	export class DownloadItem {
	    id: string;
	    url: string;
	    fileName: string;
	    savePath: string;
	    status: string;
	    totalBytes: number;
	    downloadedBytes: number;
	    progress: number;
	    speed: number;
	    remainingTime: number;
	    error?: string;
	    // Go type: time
	    startedAt: any;
	    // Go type: time
	    completedAt?: any;
	
	    static createFrom(source: any = {}) {
	        return new DownloadItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.url = source["url"];
	        this.fileName = source["fileName"];
	        this.savePath = source["savePath"];
	        this.status = source["status"];
	        this.totalBytes = source["totalBytes"];
	        this.downloadedBytes = source["downloadedBytes"];
	        this.progress = source["progress"];
	        this.speed = source["speed"];
	        this.remainingTime = source["remainingTime"];
	        this.error = source["error"];
	        this.startedAt = this.convertValues(source["startedAt"], null);
	        this.completedAt = this.convertValues(source["completedAt"], null);
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

