using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [ ( name = "main", worker = .worker ) ],
  sockets = [ ( name = "http", http = (), service = "main" ) ]
);

const worker :Workerd.Worker = (
  modules = [
    ( name = "worker.mjs", esModule = embed "worker.mjs" )
  ],
  bindings = [
    ( name = "NODE_APIS", json = embed "../node/apis.json" )
  ],
  compatibilityDate = "2023-10-01",
  compatibilityFlags = ["nodejs_compat"]
);
