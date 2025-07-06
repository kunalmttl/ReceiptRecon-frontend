// app/Home.tsx or Home.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
  { label: "Grocery", icon: "cart" },
  { label: "Electronics", icon: "laptop-outline" },
  { label: "Clothing", icon: "shirt-outline" },
  { label: "Home", icon: "home-outline" },
  { label: "Pharmacy", icon: "medkit-outline" },
  { label: "Toys", icon: "game-controller-outline" },
  { label: "Sports", icon: "football-outline" },
  { label: "Beauty", icon: "rose-outline" },
  { label: "Automotive", icon: "car-outline" },
  { label: "Pets", icon: "paw-outline" },
] as const;

const deals = [
  {
    title: "IPhone 15",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHKobaohRFVeFUIreijsApWQ7XJPLhxy6YkA&s",
  },
  {
    title: 'Samsung 65" Smart TV',
    image:
      "https://jamesandco.in/wp-content/uploads/2024/09/SAMSUNG-65Q60D-LED-TV-494410283-i-2-1200Wx1200H.jpeg",
  },
  {
    title: "Levis White Tshirt",
    image:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEA8QDw8PDQ8PDw8PDQ0NDQ8PDQ0NFREWFhURFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGRAQFysmHyYuKy8vLystLS0tLS0vMi8tMC0tLSsrKy0rLS8tLS0rLS0rLTMtKysrLS0vKy0tKy4tK//AABEIAQMAwwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAAAQIDBAUGBwj/xAA/EAACAQIDBQMIBgkFAAAAAAAAAQIDEQQhMQUGEkFRImFxEyMygaGxssEHFFJykdEkNENic4KS4fBTY6Kzwv/EABkBAQADAQEAAAAAAAAAAAAAAAACAwQBBf/EACQRAQEAAwABAwQDAQAAAAAAAAABAgMREiExMgQiQfATYXEj/9oADAMBAAIRAxEAPwDyPi4bPJlNVZ3WjLJq/wAyCj+Bx10e7GMnFRWbs1bqsz1vZdbjin1R4zsDENSSXWx6lu/iOyr87X8THtnq3ar9rpGDRFSHcqWhILDTE2csdh8Zj1MVBLOXqFiqPGnG7Sf2W0/xNfDARi84KffK8veSxkSk7WVHFRbtbLW6sdNu32m5Wtwp/i/8Zy+HwVJPKlG7tyO32DgVRpWStxPi8FyRdqwnkq+qsxx5GxAANbzQAAAAAAAAAAAAAAAAIYAB8gS/zxCSurWO23R3Q+s1JTqJrD0mnUyzirp2k9OJpPJaXRs6u7GDrznUo05UqTlJQipyd0pWvfvsyGWck6txwuV5HH7uYCUm5cLsnll0X9z0jYdJqKuizZuzIU0oQilFKyRtI0raIyZ5eVbMMfGcWwlYtjO5Wo5FTnYrTZVyLZV5ZE4VE+YFpGpS8bEkOUrZyailq20kjnK72M3YWBjKosslm/A6w0u69p0/K02pQn6MrPtJPVdxvZRN2nHmPqwb8u5IAMC1SQDABAAAAAAAAAAAAAAAAHnW/NRYajDCYSKhLES4Iwh2Vd6t87av1FWEwip04U46Qio3fO3Mu3vppbRw85vLyVRUk9PK5e3h4vaTg1Yx7793G7Tj9vUaUS2SIxVmiySKlpxMbEwMgx6jZyusOqh4fDXd2XKnnmZVCCIddi+jTsjXbzwl9Wq8CvNpRppaucmopetuxtIMu2ZhvrGJhG16eGaq1Xydb9nD1el6l1O4Y+WUhll4zrpd39nrDYahRX7OnCLfVpZmxBIdj05OPLt7eqZKwi2ehUdcAAAAAAACGIAAAAAAAAAADjPpL2PLEYVzp38tQflaTWvFHkvFXXrOT3V2v9YpJt9uOU139T1yrSUk01dM8Z3v2FV2XiniqCbwlad5JaUqjecX0Tej9XQp3Yd9WnRnz0dTfIuWaNZszHwr01KD5Zrmn0Nhh3dW6MyWcaZVdadjGeIMvEwMdUV0IJoU5uT0sjMhkRhTsY+KxNskc46ni8ZJONOkuOrUahCK+0zut39lLC0Y078U3edWfOpVfpS+S7kjS7nbC4P0mqvOTXmk9YQfPxfu8TrUbdGvxnaxfUbfK+M9gMQpysrmhmV1ZZ5BGXUgguBPh6EUJsSbAkAlL/NCUbeHiAgG4sQCAYgAAAAAAAnYoxWFhVhKnUhGpCacZwkk4yi9U0XIYHle2dxcTg6jrbOvWot3lhnLztPujf017fElsDaPlZShOMqVWNvKUpxcZxfg8zqt9t7PqNNKlBVK1TjUHK/kqbja7dvSa4l2cvE8i2ptjF1pxrV6tZykmqVRp048OrjTtZW7kU56pfZbPqfH3nXpteKMWNSN7HPbs7Qk8NPjm5uNSVnKTlKzinq/WLB4tyqPMx3HxvG3DLzxmUb/ABddRizK3V2M8RPytReag8r6VJLl4dRbI2BPEtTqNwo93pT8Oi7zvcPQjTjGEEoxikoxWiRfq1dvlVO7bJPHH3TSHYYGtjIqq9OhbJ2KQI2CxIAIiJMiwAaIkkBNSHZMihpAJoRdJFLAQAAAAABJPmVVW3knZc2tWvkJMGB599LFJRw+GaimoV3aL0lFwbaf9Jr99t8sFi9n+Roxm6tSVGUacqTh9VcJJt8Wjdk49nW/Q330qUuLAqX+nXpyv0upR/8ASPGJzzOVXlbK2mzMa6aqRvlNL8U/7noO4W7brQeIrXjCT82tOOK1lfocJulu/V2hXjRp9mMbSr1bZUqfXxeiXP1M+gqOGjRpQpQVoU4RpxWr4Yqy9xX/ABy5drRr22a/GNVisU42hSvGMLZrK7XyNjgcdxJKeT+1yf5EYYRatFjwyLVbNQGFBTjpmuhlKba6MCNSV3bpr4iFoRuBK5FyCw0gI5saiSsK4BYEBKwDRKK5kUTfQBEaiJBLQCkBiAAAAKh3EJgc5v8A0eLZ+KWvDGNRfyTjL5HiGDwU69aFGlHjqVZqEIrnJ+5c/Ue/7xYd1cJiaa1nh60V4uDscV9DmxE518dOPoeZoN8pNXqSXq4VfvYqGU7XebqbvUtn4eNGn2pvtVqtu1Vq2zfhyS5I3E46DixVGE0QbE2IAbEMYEbDsMQAAhgIEhpDAAAaAcUKLvmEnl7CMWBYMihgVyWZEnUIAAAAFTQmTIsCqpG6ku5+41n0eYTyezMKlZOanVllq5Tk/db8DbMp3Thw4HCLpRgBtIxIz1JIjU1AiAWAAABAMQAABYYAAAAANESQCnyRCWQX7XhkKTu2BbHQkiC0JRAU9CstnoVAAAAEbCsSEBWw2JHhw9KP2VKP4Ta+Q5oswCtTS07VT/skBeiNTUkRmAhDABGqnvJg4ylCWIhGUJOMlJTVpJ2avY2xzlfdyr51wr015SpKcYzwynHhc5T4ZO+ecpfiRy7+F+jHVbf5Lz9/ytrh9r4apbydelO8lFcM16T0XiZxz+C2DVhWozqV4VKdLik4wpSpynUasnLtNSS1XSx0Ax7+XN2OvG/872fv9QAAySkWEMAIhf2DZCpp4+4CCdlfmwpaX6lLqcTstDJS0AmNCGgHLQqLkVMBAAAIAGBGSLMNG0bd8va2yDLoaAOxCqibIzAimMihgMAAAAAAaGJAAAAgAxNoVbJRWr9xmI1OOnerJfZUV7LgXYWJmIxcPoZaAkCYgiBNEJrMkDVwKwAAEMQwETiyJKIA2JsbIyABoSGgGMQAMAFcCQCAAENiYEonP4qr+l1Y/wC3TmvDT5G+TNJtug1iKNVaSjOnLwdpL2x/5AZ+CdzLRhbP0Mu4EmxxINk0BIaEhpAJwAm0AGOCAAAnEgiaAGQkTZCQDiMjEkwGhkUSQCETZACSHYSZNMCDQnEsACtQZqd5KnBGjzvWSf3eF/Oxujmd7ajvTXJKVvHLMDP2ZUun3GcmaDd3GqV4P0lnfqjoY2ASLoogmWIB2GiuvXjCPFOSiu/n3Lqc3tTa8qnZheFPn9qXj3dxXnsmHus167nfR0kK8ZK8e0no08mBp9l4pKjBX04viYHcc5ZKjljZbG0AYE0SJIiTiAMrkTZCQEokiMSQCRJCGgGRZIAIoaAAJJjTIpDSAZzG96yg/v8AyOnNLvNQ46Tf2VJ+wDmd3bvERSybUvYr/I6yntGjmnVgnFtSTkk1JOzTTOV3W/Wofdn8LMjeXDeTxDmvRrLi/nWUl7n6yvLK4zsW4YzK8rop7Zw8f2nE+kIyfttYwq+8TeVKnb9+pr/SvzObpyLVIzZ7smjHRjGTXryqS4pyc336LwXIqkyKYNme3rRJxbTrtJJAUpgT8qhcY7lAIbPSeaiTiQJxAbK2WSKmBKJYQiTAQxABIAQAFgsMAAAABmNjaXFBrqmvYZAmBwu68f0qPdGfwnT7bwHl6Mor049um/3ly9aujR7Io8GNt+7P4TqyPOziXeXsedxl1y6rmmWKZl704dU67ayVVcf817S/P1mlVYw548vG/DLs62EZliMSnIy46FVi2I3AGA6cd6JjBnqvJRJxIInEAkVsskVMCyJMriWAIAAAuFxDAaY7kbDAkAAAESRFgaRULYuEu6fws3Bh1oeepvx+FmYcdrkN+5dqh92fvRzEGdFv+/OUPuS+I5ynexk2/Kt2n4Rl0pGyo6Gtw6NnS0KKugcRg0BFN3AmMieq8cEokCcQGytlrKpASRYiu5YgGyJIQCAYAA0IYDEDBAMTGJgYldecp+L9zLyjEvt0/vfmXnHa4jfzOvSXSl75y/I0lGGRut9c8TD+DH4pGrpRMez5Vv1fCLaUbWMuDKYFsWU5LYtuBXcZFJ3TEAHqvIDGhgAyuYAA1yLEAASEAAAgAAJIAAUxoAAYgADDxXp0/vfJmQAHHa4nfL9Zj/Ch8UjWUwAx7PlW/V8IvRJsAKMl0TAAIpP/2Q==",
  },
  {
    title: "LEGO Classic Bricks Box",
    image:
      "https://i5.walmartimages.com/seo/LEGO-Classic-Large-Creative-Brick-Box-790-Pieces-For-Kids-4-99_c88ff6ee-c17e-443e-981d-6545d349e580.27dca85c71615bc13c8c32b38e7f0ba9.jpeg",
  },
  {
    title: "HP Pavilion Laptop 15.6”",
    image:
      "https://i5.walmartimages.com/seo/HP-15-6-Touch-Laptop-Intel-Core-i5-16GB-RAM-512GB-SSD-Windows-11_8b31fc12-bb0c-4da9-9a4f-9e8ed130aa25.6fa914b81c3b3aa198b0baf0d7310dc3.jpeg",
  },
  {
    title: "Keurig K-Classic Coffee Maker",
    image:
      "https://i5.walmartimages.com/asr/2a5e0da5-7f68-4d3a-b9c5-c0d9704d979f.18f340e267fbb21ba3c346a875e8cf92.jpeg",
  },
  {
    title: "Xbox Series S Console",
    image:
      "https://i5.walmartimages.com/asr/cc315189-410c-4f14-9460-379b2c4c0d5c.2dc9a7f78b91e2359d90edc3f55af57c.jpeg",
  },
  {
    title: "NutriBullet Pro Blender",
    image:
      "https://i5.walmartimages.com/seo/NutriBullet-Pro-900W-Personal-Blender-9-Piece-Set_2b441d75-4aa2-41e3-9e0f-0f0dd1e4dc91.4464c2c807f0e93a0b14b176d2d92470.jpeg",
  },
];
export default function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.logo}>Walmart</Text>
        <Ionicons name="cart-outline" size={28} color="#fff" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#555"
          style={{ marginHorizontal: 8 }}
        />
        <TextInput
          placeholder="Search Walmart"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image
          source={{
            uri:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQEhUSEBAVFhAQEBUVEBAQFRUVFRAQFRUWFxcRFhgYHSggGBomHRUVITEiJSkrLi4uFyAzODMsNygtLisBCgoKDg0OGxAQGi0fHR0tLS0tLSstLS0tLS0tLS0tLS0tLS0tNy0rLS0tLS0tLS0tLSstLS0rLS0tLS0tKystLf/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAABQYHAQMEAgj/xABLEAABAwIDAwcHCAcHAwUAAAABAAIDBBEFEiEGMUETIlFhcXKxBzKBkaGywQgUIyQ1QnSCMzRSYnOz0WOSorTC0vAVU3UlVJPh8f/EABoBAAIDAQEAAAAAAAAAAAAAAAADAQIEBQb/xAAlEQEAAgIBBAICAwEAAAAAAAAAAQIDETEEEiEyQXFhgQUiIxP/2gAMAwEAAhEDEQA/ALsQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCFGNtdpJaNobTth5RwJdLVStjhgbwLhcPkJ/Zb6SNLgSdCp07Q185+krHb7BtM0RNJGhy2GfLfdck8eNgzosar4/Nqc4H3JwyQekiz/wDEo2nSz0KGUu27xpUUp71O8H05JMtvQ4p1RbVUcpAE4Y8mwZODE4noAkAzei6naDlCAohjON1b5hDSmCKPNYySkSzSDiY4muswdb9/QFW1orymImUvQlcFM4AZ55XPA5zg4AX6SAA31ADqW9olHmyBw4CQWP8Aeb/RVjJC3Y7ULl+duHnxOHWyzx7NfYtkNXG/RrwT0bj6jqrRaJV1Lchaa2pETHPIJygkNBaC48GguIAJ6SQOkqHYRieIVkzs80EMDd8VKRNI392WY3bfX7ljqNRxshN0Jcymt5s01+DnPzA+h2hW0OmG4xyDo1Y74g+xRsOxC5Pn4b+kY9nW5uZv95tx67Lohma8XY4OHS0g+CkPaEq2ixV1NHeMRl53GaRscbB+28kgkdQ1PUozRYhVTDNLVAg2t81bycZ7h1eR1knqtvV6Y5twpa8V5TtCjMck7PNnd1tlyvv1G/OHrXZHjErf0kIcP2onWP8Adf8A7lacNo48ojLWTpCXxY1A7QvyO6JQWe06H0FMGm4uNQdxG4pcxMcrxMSEKKbT7QzRP5OndTx9MtQ4Oc48WxQtcHG37TtNDw1VN4t5VcQklPzWY8kw2EjwAZbfeyts0DoFu0q1cdreIR3Q+j0L5+wjy110NhVU7JW31czmkD23PaVOcE8tGHT2EueB54SC7R2uGgUWpNfEpiVkIXBhuN01SA6CojkB3ZXC59G9MFVLCEIQAhCEAIQhACEIQAqO2nwkzV9RUPF7TutfXmRHK0dlmBXkqoxqGVz57zBrc81hGwZrZnb3Pvr2AKJTCKz1D2Qv5M2lkfHTwuP3XSb3dtgVEsS2lqIpTHSyOZHCco0a50hboXvLgbkn0blKZpWsbA55swYjDncdzQWPGc9Qvf0KF41AaWpnjliBu/TNcZRmuCO0aH/6RHKJTzZfaZ1VHmdYSMIbKzhci7XjiAbHTgWnqUoNK90XKFgyOvpwcAbaD/l1VewJIfO4eaGMH5y85fYHq1Ydqc9K6F8JzatbI0czKTca8HC9rKJWgrp6kQuYY5nwwl4EnJPc1mQuAfdg5u6/C4UuwB1GXj5o9jiw3fkBFhZxG8Di1Vo2Zp5Vr7lgkLjlsDZzjcAndqD61KdgcvKvDIsjTExwOcvMgPKjnXAAsWncOKRljyvST3bjHHU7RYkRwUz6qcNcWmZwIZFAXDVoc97L24XCqCh8qmJxzCV0okizc6nLGNjLf2Glou3TcbnrurU29w81AqoGi8kuHNMQ/adG8SBg6yWgL59dMDGGZAHN0zje7nOOo/Nb8oTMdYne0WmY4fWOD4zHU08dTGfo5ow9t94v9024g3HaF1l7HjnhrgNDmGrejeoF5Hw8YRH055nR5t2XlXH1XB9allTNmieSMvNsR/8Aip+FnLtFh8cobG5xEebNybnFzcw0Bsb9JWzAKRkV2R2yuewXHHQk+A9S46iXlAwnU5fWdAu3ZtxNiRY5xoNwIDhYepXrPnSloV95S9tJ6XM6F+WSaZ8VNxbFBCG8pKGnmmQvflBN7BptvKU+Tvyn1RqWU2IScpHO4Mjmc1rXxSO0aDlADmk6ai4uNbaLHldwxxp6eoaLiCeaOYbw10rg9pPVpb8wVaueZZW8izLI+Ucm1nCRz7tA9JA9ATYjwo+thWFu8/17VmRkT9XMbmIuHt5riOm416FyyyuaQQAQbhw48NR07kvxKpLXRkD7zr9QcQD4+xV+U/CN4/hLJ6lz5CXloDGGQ5i1oHmgnrJPpXZ86+bwySgXMMN2D+0ebA26blaaxj3Pc4OAAeNw1AJAvr/Reaw2ppCbkNEBd0kCRt1tp6/plvyq/afa+thnMMNQ4OisJZNHGSYi7jzr2aCbADo4qeeTTbV2IMfFPYVULQXObZomjJtymUbiDYEDTnC2+wrbbil+a4hOXMD45udGTuc19iHtPo9RPSu3yQAnESW+aKaQv7uZgH+ItSImdnTEaXo05gdxF7G+4noXJMGsBdETG4X/AEbizndYGh9IW+nrnNzMcy7b3a8bgDwd0G9/WkdTUHPI3gbEG+8gAbvV6k2lpncWKtWI1NUYxrC2U9LUzMtyogkJf94uc0tLieJu5VlS09o2dbQfXr8Vau18bxRVJLuaaV55oAvZ7BY3uba39Cr+Cn+hiPTCw/4Quj/G0i2S30Vmv2xH2SyRpZWMAcSQdW6EftdafzxLhlYndV0/fGlsdyimq5IzeN7mnpYS0+saqXYL5UcTpbBtRnYLcyYZgB1cfXdRySmaeFuxc76XoPrXIt02Sv5aIvErqwby8DQVlIR+/CbjtIPwVlbLba0WJfqs4LwLmJ3NeB05TwXycG2FluoKySnlZNA8slicHMc3TUfBFsExAiz7MQlGyONivo4Kpoty0YL2j7sg0e3+8Cm6zLhCEIAQhCAyquxh3On783i5Wiqqxk8+fvze85RKYQfF2h1LY7nVDQf/AInpJDHyoyVEbpmMvkmY48rGDrlJIIcO3cnuIUxmhZE02Mtaxub9kGKS59QKh2KYrJyrmwOdHDCcrGscRYDibbybXuUQEihjY50dNAwxQX5Sch2aSRo3uc7s0AGguUqrdp6wyZoqh8TGc2KCN1omRjQMLPNdp0g3XdsrijXyh85ALmPp5nmwF5GOdFKeAJewNPDceJSOviMT3MdbTd1i9wR0hWrEb8olIsMr+XjfLlDS4DO1u4PDjmt0Djbheyl3kska6achx8xmhOlhyvOA4A69tlB9kYOUiLP+9KGj8zg2/r8FJvIu69TWdWQW6AOWFvYkZIMosva7DeXtleWSMY0skacpGnTwULbsFBVycrU0/wBI43kfTylkc54vczLzSeOQi5udE58olWYnPldrHS0rZBGfNkmdzIw4cRmINv3VTNJtliMcgqPncjnE3LJHF0bhfzTH5oHYBbhZRWszwmZiOVk7YYo+mY4w82Kma2GliAtG2U2s/LuOVu699VAsL22raaTO+pkmif8ApYpnue1zTxbcnIR1dHQpftBOyvoOUj0dI5s7GX1PNyyMHSWujI/MFWNXJzdbXudBobk7rK+KtZid8q3mYmNPoF2IMbAyUnmOZcW1JzHQADeTcC3SU72OlY9jHRm7C7Q3B3F4IuNDYgj0Kusea+LCYt+aKFt+q9mX9GdSzyPn6hTfm/mSqlI8zKbz4bcfwgynM0tIeC2WCXWOdjrXa5voBBGoIuOIKvAdg6Ojf86bTv5aIF0YllMjIXW0LBlaSeguvbfvUc8pOPz0kbTE8tqKyR7WyDzoaePKC2M/dc5zt41s1R/YXbipinbT1U75aepcI3GVxe6J7zZsjXO1AuRcbrXO9O0Wcbf7SVUGSKKeSOWpaZp5WOLXiMvLYqdjhqxoDbkC1y5cuw22dRJKykq5HSh1+RmkJdI0gXyFx1cDbjqLda2+VWlzGGpZazYhBON/JStJPOHC5z26hdRLZRpfiEAbvEmZ1uAGpv8A84q8RGkSt/EKxjX5XutdwN72AGZoFz1uLQBvJNgCu8AGCQHcWxg9hcq+8oLnNqqUfdlqWOJ/hvja0ejO8/mU4rS75tKGec7kWt7zpAB4rRTgi3KKYhs9yx5OQcrFe7OeRJDoBzHWOlgOadNOCY0uCsooRDRtdHJUvDZJnOzSkNBN72s0AZiAB1qvNrsYmZUPpoJXsjp+a50bnNMkgAzSPLdSSTu6lJdgNqnTFsdU7M6mdm5Q73U8n0T3O6SzODfeQepL7o2vqdEe0O1lWZ3NpqqWGCneWQRwyOaCGm3KSWP0jnEEkuvvPBSzY3aN9dG4zAcvFZsjmiwk3WksNATbUDS+625QPaKkMFRI02ylznMItZzXcQeI7OhO/Jg03qHjzbAA8L3BRT2FvVKNqaxj6SraH84UsgDb+dlkjDiBxykgE7rm28GyGno/qsBtvpoj642rkxOllZLXmTzP+mzRx68IpqdrtOsku68xUww6kEmH0rm/+0hB6nCNoIXU/i8kVzTv5hg67xSs/lAKyBK5mKV4nS2JUfqYl2s2PcbUw5NlMjVocF2ysXK8LlZKabKy5yF4K2uC8ELLaDYfQ/kBmzYWW/8Abq5WjqBDHf6lZKrD5PY/9Nk/Gye5ErPXLtybAQhChIQhCAyqnxk/ST/xJvecrYVQ4y76Wf8Aize85RKYR+jqmxFr3jmRTxyP6oyDHI/8rJHO/KoFiznUc80ehjlex7XWuHta4uaQeg3UzcCRpvtYjpB4JFLRvtyZibNCDzGSEtfF+61wN8vUiJ1O0TG+SfZ+IPbMXDmEMZ2uzX8Gn1pvSxMtycrWTMZ5gkDszP3czXC46isPY9oDeR5Njb2YwHKCd5J4nrXPTsObqN7dd+CAaxykNe5gDC1rTHkFgyxJblHoCkfkgeJK2seG5eVLHlm8NLuXJA6rkqPtgLInE6F3gOPrJUo8jjvrc7beayLXiSRMl3XrylXlCoOXhljFs1XStZFfS9RA8ubHfpOZv90r55mr3ZBFILGJuQAixFnF2vXckL6k2hwsTROicDlcczXN0dG8bntPSoONhGyycpU08UsgP6YBzS/rkY12V7ushVx5O1a+PuLNjNn2TYTEahxiLXSSslvYxMLiQ+/AW17CmVDsdRloqc0U7/uysZlBde2ozFua/UFIMbw0y0slOzml0dmX0GYEEA9AuAOxKNjcIngppGzsyudLmay7XFos1t7tJFzbp4KOfKePA2mZmpnMyZmyRSMcwaXad1jwIIB9CaeSxnJ0MGt8hIJIsf0ku8HcepYro7ANPAagcUz2Dl+cUmYtDc4BDRw5z7KacyrdX3low53Jwzx6vw+Z4lb0RSPDopSP2ea0X6XKqWvfVzMZGPpZpQ1uUW573kj2u9i+kNocMfI4OGkjWlhLmhzJojvikadHNPR/QEcGAbH0tK/lo6ONkxvz28o7LcEHIHucIxqRpwNk6LajRWvO3naTB6blOWfUMhdN9G9swDoqlv7L2Ei9tDmBBHSFpg2cpaI/V4I2Odq5zA7MfS9ziBqdL2WnyiYDPVthfTtzuhL2ujzNaS1+XnAuIGmX2pqykcyOFrzd7Imte79pzWtBPrCEoZtizlHwtcDaOrZJHKNcpOQFjh+ycu/gSCdFK81o3WFyGxyNaN7nQvbJlHbkt6Umxuo5Ih1sxM8bADuGZ4F/UfBOmA5WkbwNFsxxuP0zXnSntu2Glrp5IyHQVrSY5BqHMcWuNuggtXryas5Wte63MEEmew057mgN9Z3fu9Sm+J4Byhc3I18D3ZjBJf6N53uicCC266sJwtlK3LFCI2k3Ibc3PSXHVxVP+cxP4W74042bO0znmB8jJGDnCmkBLor68xzXhzRu017ExipI4mlkMbWMAIDYxYbx6ze+/VJv+lTCu5Yfoi7OX3GnNsWEb78OwqQSsyjdbXd6VaseeEWn8ottLVGUVJc3K9mGzB2n6QumpvpGntbqOFxvTfYWtHzeGNx5roIx2HILFcG01QRFVR5RY0Mjs53kiSn07Of7Et2YqbQxD+yZ7oWro67vb6I6mO6mpSLaDDspOihddBZWcwioh/fYNetvA/BQvGKOxOi9B0+Tvr2zzDl0maW1KGzsXFI1OKuKyWStWbPj06eO24cTwtTguh4WlwXNvDREr/8Ak9/Zsn42T3I1ZyrH5Pn2bJ+Nk9yNWcuRbk+AhCFVIQhCAyqYxx300x4/OZx6CX6exXOqPxuT6eb8ZN70qiQURlbgAd4XPGVvYVCW1sDeGnYvTaVoN+PYFhrl7c7RALsXN2kdSlHkrZacEjnOpmZj02mrAPYAopWm5HaPFTjyettM3+CP5lSlZJMosorW6Bp4Be1hJMajAFzTxBoXaVx1h0RsIziQu9ve17CU42JjDIS1osAG6DrLifaSlkv6QJvsp5juxngU7HyVc9dGDvC1Oom8BbsW8LKaW4pKLr9eqV4jEGhP3lIsXOhQEJq4Wvc7MLjM069Ie2x7ePoTOmPNHYl73av7w99qYU3mjsC3YmXK32B3hAhb2diAvQKeQ1OgA1/oleIO8R4pvKdEixJ3iq24WryVbUxj5pUuI57aNzQ7910jCR/hHqUPwKa0cf8ADb4BS/aY/U6vp+bceIztt6N6gWEyWYzuN8Am9DP+k/S+b1WLgVflIPrHSOIXdtBQgjO3zXC4KieG1FrKa4XMJYzGd9rt7ehdbzjtF4/bmZq78x8K2xKGxKRztUsx9gDiOgqMztWnPXcHYL+C2QLneF2ytXLIFyctdN1ZX18nz7Nk/Gye5GrOVY/J8+zpPxsnuRqzlwrctUcBCEKqQhCEBlUJjcn1mcdFbNfq58g+KvtfPWNv+uVH4uf+a9RIamLa0rQxbAVCW8OWXOWoOQ5yA5J9XDvDxU92BcDMLfdjA9szv9SryKcPe0jdygF+m1tR1KwtgmWmvwNregPSMvJlFjXQvN0XSjWSVw1h0XW4rhq1MAilcA+53AJxsqLNdffaO46DYpORd57PinmACxkB4FngU3HyTc6C9LwFkFOLYkKQ4ud6eSFIsVGhPQgIZK/nOHEu9gIN/YmtL5je6Eqc27ndpPtTSlPMb3Qt2Jlyt4WbrzdF07ZLxMdEhxI+KdzFI8TaRa/E/FUtK1YcO1f6lU/hf9YVcYY7mM7rfBWLtW0/MqkndyGUW6nA/H2KtcMfzW90eCb0U/6Svlj+iS0JTmOsc0aEg23jguTCaTMLhNDh56F6KsV15ci2SYlGJ3uOjiSek8VxSxKS1GGnoXHLh56E2axMFxl1KMzRLgmapJV0ZHBIqtllz+px6h0cGXuXf8nz7Ol/HSe5GrOVZfJ9+zpfx0nuRqzV5a/MupHAQhCqkIQhAZXzljj/AK7U/jJ/5z19Gr5rx1312p/G1H856iQ3tXsFeAs3UJe7pmKVohLiLuyF1+g2uEpum7JbwHqjcPUCEBEcLmLpGAgBocNw83VWrsdHlmFjcH/a5VLg5+lYP2ntA7bq3NkxaZo6B/pckZuYNxp0hYusXSjBvWnEYwALDebexbc1j6VrxI6DvfAq1VZIhC3lSL/dB9PQm2C+dL1FnupYIjy1+BaD6tEywY8+btZ7qZT2LvwcBZXkLKcWyBfelOIwtJIO7qO7TemjXJdWi7nDpFvYiAgvJi7yHbnOt1jVdtIeY3ujwXIYiwyA7w5w06rrpo/Mb3R4Lbj4ZcjoRdYWCmlOyCmaWXcL3v6Ao7isLcmYk5gRbr13KSUjrs7Lj4qP4pEXR6fdId6Bv8SlTPk2I8FO2LLUFRY74viFUlJezbHgPBW1tkLUFQP7L4qqaHzW90eCd08f3lefVZWwlcxsZE4ub80t0s224gqXtnp3cSO0f0VV4XVZU9hrz0rqRW0/Lm5MFJnek1fSwu3SN9OnitTsEDvNse6QfBRUYj1rdHifWpickfJM9LHxJhimzxyk5dwVW4vZriOgqxZ8fka02kcNOkqrcShs42J38TfxVM3UX7dWhp6Xp+2dzK9fk+fZ0v46T3I1ZyrD5Pf2dL+Nk/lxKz1563LqwEIQqpCEIQGV8z47+u1X46o/nPX0wvmTHD9cqvx9T/PeokO26LrxdF1CXu69tqS1rmjc4WN+Fxa4Wm68vKA4aWAMlaQfvi3VqrM2Kqs84uNRvt3XKtSee3vBT7YB31n8vwckZuTMazEXWFi6WY8vK5Kyc2A6F1PKX1h0UwCt9YRIXdQAHCycYBJmdMelzPdUek87/nWnmzB/S95vgm05Kufhel4CzdNLa5XWSfEKwtJNhf4prMUgxU70BEZKsh7wdblxJ43N01o/MZ3R4KPVR+kd/wA6VIKPzGdweC24+Ga7oWCsXQSmFvIqSy9uI3HxSTEawluS28i56QDuTOc6JFXnX0jxVLLQ07Xz5qGoHHkdfWqtpDzW90eCsfaZxNJU3FrRWB6Rdpv7SPQq3pfNb3R4J3Te8/S88GtNImtPIksCcULbkLs4a7Ys1tNtQ8i3ajlyFKKXA2TQuc64LAHC3SCNFGcQhymyXk8WnSuK8XhyVNVokVYbld1Q5LpismW223HC8/k+fZ0v46T3IlZyrH5Pn2dL+Ok9yJWcuLblpgIQhVSEIQgMr5hxs/XKr/yNT/mHr6eXy7jcg+fVTeP/AFGp/wAw9RId5KxdeCUXUJe7rw8rF15cUBzk89veU+8n/wCs/k+DlX9+e3vKe+T196n8nwck5eTKLQWELCWu8PS+sK7pCl9WVIJned6R8U72Z3y95vupJa7j6PinWzW+XvN91XpyXfg+BWSV5BQSnFtM5SDFCns5SDFCgIXVt+kd2f7k9pDzG90eCS1LDnJ4WPx/qnFJ5je6PBbKcM1nRdYcVi68uKurponKSVp1HeHinE5SWrPOHeHiqymHJtUPqdR/CPiFWlL5re6PBWbtZ+pz/wAI+IVZUvmt7o8Fo6X3n6Wt6mECe4U3UJFTqQYQNQu908eHK6qVgYaPq8nc+IUJxkalTjD/ANXk7nxCg+M7ysmT3sjpuP2i9Ul0pTCrS6VYsjq0Xv8AJ8+zpfx0nuRKzlWPyfPs6X8dJ/LiVnLkW5aICEIVUhCEIDK+WMc+0an/AMjU/wCYkWEKJDvJWLoQoSLrw4rKEByg89veU88nP6z+X4FCErKvRaF1glZQqGNMhS+r3IQgFUfnO7B8U32a3zd9vurCFantKl+D0IJWUJxTlnKQ4mUIQEUqPvelMqU8xvdHghC2U4Z7ctt15cUIVlXLOUmqzzh3h4oQolaGjaz9Tn/hHxCrGl81vdHghC0dJ7z9It6mNOpBhG8IQvQdPw5PVrDoP1eTufEKC4zvKyhYr+9k9Lx+0Wq0tlQhYcjq0Xx8nz7Ol/HSfy4lZyELk25aICEIVUv/2Q==",
          }}
          style={styles.banner}
        />

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.label}
                style={styles.categoryItem}
              >
                <Ionicons name={category.icon} size={28} color="#005CB9" />
                <Text style={styles.categoryText}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Deals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Deals</Text>
          <View style={styles.verticalDeals}>
            {deals.map((deal, idx) => (
              <TouchableOpacity key={idx} style={styles.dealRow}>
                <Image
                  source={{ uri: deal.image }}
                  style={styles.dealRowImage}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text numberOfLines={2} style={styles.dealRowTitle}>
                    {deal.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#0071CE",
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingTop:40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    margin: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontWeight:600
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  banner: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    color: "#333",
  },
  dealItem: {
    width: 120,
    marginRight: 12,
  },
  dealImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  dealText: {
    marginTop: 4,
    fontSize: 12,
    color: "#333",
  },
  verticalDeals: {
    flexDirection: "column",
  },
  dealRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 8,
  },
  dealRowImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  dealRowTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});