import { DeckService } from "@/service";

export const useDeckService = (): DeckService => {
  const service = useContext(DeckServiceContext);
  if (!service) {
    throw new Error(
      "useDeckService must be used inside a DeckServiceProvider.",
    );
  }
  return service;
};
