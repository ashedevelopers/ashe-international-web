import { createContext, useContext } from 'react';

// useCampaign() opens the current-campaign preview (title, description and the Zeffy donate button).
export const CampaignCtx = createContext(() => {});
export const useCampaign = () => useContext(CampaignCtx);
