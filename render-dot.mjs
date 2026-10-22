import { Graphviz } from "@hpcc-js/wasm-graphviz";

let source = "";
for await (const chunk of process.stdin) {
  source += chunk;
}

const graphviz = await Graphviz.load();
process.stdout.write(graphviz.dot(source));
