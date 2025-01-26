// types.ts
export interface TokenPricePredictionData {
    block_date: string;
    data_type: string;
    open: number;
    prediction: number;
    prediction_lb: number;
    prediction_ub: number;
    token: string;
    token_address: string;
    token_symbol: string;
  }
  
  export interface ApiResponse {
    data: TokenPricePredictionData[];
    pagination: {
      has_next: boolean;
      limit: number;
      offset: number;
      total_items: number;
    };
  }