import matplotlib.pyplot as plt
import matplotlib as mpl
import json

data = []
with open('download4') as f:    
    data = json.load(f)

votes = []
total = []
messages = []
breakdown = {}
count = 0
for _ in data:
    session = _["session"]
    instance = []
    m = []
    for user in session:
        for v in session[user]["votes"]:
            v["user"] = user + "*" + str(count)

        if user not in breakdown:
            breakdown[user] = float(0)
        breakdown[user] += len(session[user]["messages"])

        m = m + session[user]["messages"]
        instance = instance + session[user]["votes"]

    if _["event"] is not "mergeless":
        count += 1
        total.append(len(session))

    votes += sorted(instance, key=lambda k: k['time'])
    messages += sorted(m, key=lambda k: k['time'])

lookup = {}
count = {
    "INCREASE":0,
    "CONTINUE":0,
    "NOVOTE":0,
    "ABANDON":0
}
numbers = {
    "INCREASE":[],
    "CONTINUE":[],
    "NOVOTE":[],
    "ABANDON":[]
}

r = range(len(votes))
for i in r:
    #print(votes[i])
    if votes[i]["user"] in lookup:
        count[lookup[votes[i]["user"]]] = max(count[lookup[votes[i]["user"]]]-1,0)
    else:
        lookup[votes[i]["user"]] = votes[i]["data"]
    

    count[votes[i]["data"]] += 1
    for c in count:
        numbers[c].append(count[c])

plots = plt.stackplot(r, numbers["INCREASE"],numbers["CONTINUE"],numbers["NOVOTE"],numbers["ABANDON"], colors=['#348abd', '#7a68a6', '#a60628', '#467821']
                ,labels=["Grow","Stay","No vote","Abandon"]),

# make the legend
proxy_rects = [plt.Rectangle((0, 0), 1, 1, fc=c) for c in ['#348abd', '#7a68a6', '#a60628', '#467821']]
plt.legend(proxy_rects, ["Grow","Stay","No vote","Abandon"])

plt.xlim([547,1095])
plt.title("Vote Distribution over Vote Change for Tier 13")
plt.xlabel("Vote Change Event #")
plt.ylabel("Total Votes")

plt.show()

plots = [
    plt.plot(range(len(total)),total)
]
plt.show()


i = 1
count = []
time = []
for m in messages:
    time.append(m["time"])
    count.append(i)
    i += 1

plots = [
    plt.plot(time,count)
]
plt.title("Messages over time")
plt.ylabel("Number of Messages")
plt.xlabel("Time by Unix Timestamp")
plt.show()

delete = []
amount = 0
for key in breakdown:
    if breakdown[key]/count[-1] < 0.02:
        delete.append(key);
        amount += breakdown[key]

for key in delete:
    del breakdown[key]

breakdown["Less than 2%"] = amount

pi = plt.pie(breakdown.values(), [0,] * len(breakdown), set(breakdown.keys()),autopct='%1.1f%%',colors=['#348abd', '#7a68a6', '#a60628', '#467821', '#cf4457', '#188487', '#e24a33'], shadow=False)
plt.title("Message Breakdown by user")
plt.show()