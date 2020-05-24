import pandas

aid = pandas.read_csv("/Users/Kundan/Documents/MiniProject/aiddata-countries.csv")

dPurpose = aid.groupby('coalesced_purpose_name')['commitment_amount_usd_constant'].sum()

dPurpose = (dPurpose.to_frame().sort_values(by=['commitment_amount_usd_constant'], ascending=False))

doom = dPurpose[:10].index.tolist()

ddata = aid['coalesced_purpose_name'].isin(doom)

findf = aid[ddata]

dffin = findf[['coalesced_purpose_name','year', 'commitment_amount_usd_constant']]

sum_df = dffin.groupby(['coalesced_purpose_name','year']).agg({'commitment_amount_usd_constant': 'sum'})

sum_df.to_csv("vthree.csv")