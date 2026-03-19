import json
import os
from routers.afi import train_afi_model
import routers.afi as afi_module
from routers.rating import train_rating_model, all_predictions, get_options
import numpy as np
import itertools

def main():
    print("Training AFI model...")
    train_afi_model()
    
    print("Training Rating model...")
    train_rating_model()

    public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../Dashboard_Platform/public'))
    os.makedirs(public_dir, exist_ok=True)

    # 1. Dump Rating Predictions and Rating Options
    print("Dumping rating predictions...")
    rating_preds = all_predictions()
    with open(os.path.join(public_dir, 'rating_predictions.json'), 'w') as f:
        json.dump(rating_preds, f)

    rating_ops = get_options()
    with open(os.path.join(public_dir, 'rating_options.json'), 'w') as f:
        json.dump(rating_ops, f)

    # 2. Dump AFI Options
    print("Dumping AFI options...")
    with open(os.path.join(public_dir, 'afi_options.json'), 'w') as f:
        json.dump({"categorical_options": afi_module.valid_options}, f)

    # 3. Dump all AFI Predictions
    print("Dumping AFI predictions...")
    keys = afi_module.feature_cols
    lists = [afi_module.valid_options[k] for k in keys]
    combinations = list(itertools.product(*lists))

    afi_preds_list = []
    for combo in combinations:
        input_dict = dict(zip(keys, combo))
        encoded_vals = []
        for col in afi_module.feature_cols:
            le = afi_module.encoders.get(col)
            val = input_dict[col]
            encoded_vals.append(le.transform([val])[0])
                
        input_vector = np.array([encoded_vals])
        predictions = afi_module.afi_model.predict(input_vector)[0]
        
        result = {}
        for i, col in enumerate(afi_module.target_cols):
            result[col] = round(float(predictions[i]), 2)
        result["afi_score"] = round(float(np.mean(predictions)), 2)
        
        out = input_dict.copy()
        out["predictions"] = result
        afi_preds_list.append(out)

    with open(os.path.join(public_dir, 'afi_predictions.json'), 'w') as f:
        json.dump(afi_preds_list, f)

    print("✅ Dumped all static JSONs successfully to public dir!")

if __name__ == "__main__":
    main()
