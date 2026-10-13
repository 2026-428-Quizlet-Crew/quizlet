import { CardContent } from "./CardContent";
import { ContentFormat } from "../content/ContentFormat";

export class PlainTextContent extends CardContent {
  readonly format = ContentFormat.Plain;

  render() {
    return <p className="whitespace-pre-wrap">{this.source}</p>;
  }
}
