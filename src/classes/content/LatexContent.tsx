import { CardContent } from "./CardContent";
import { ContentFormat } from "../content/ContentFormat";

export class LatexContent extends CardContent {
  readonly format = ContentFormat.Latex;

  render() {
    // TODO: parse LaTeX. Renders the raw source until then.
    return <pre className="whitespace-pre-wrap font-mono">{this.source}</pre>;
  }
}
