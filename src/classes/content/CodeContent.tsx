import { CardContent } from "./CardContent";
import { ContentFormat } from "../content/ContentFormat";

export class CodeContent extends CardContent {
  readonly format = ContentFormat.Code;

  render() {
    // TODO: parse code. Renders the raw source until then.
    return <pre className="whitespace-pre-wrap font-mono">{this.source}</pre>;
  }
}
